import { NextRequest as Req, NextResponse as res } from "next/server";
import { attachPaymentSchema } from "@/vendors/paymongo/schemas";

export async function POST(req: Req) {
  try {
    const validation = attachPaymentSchema.safeParse(await req.json());

    if (!validation.success) {
      return res.json({
        status: 400,
        message: "Validation error",
        error: validation.error.flatten().fieldErrors,
      });
    }

    const { payment_intent, payment_method, return_url, metadata } =
      validation.data;

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Basic c2tfdGVzdF8yUWEycXB1Q0U3eVV5anB0WXlxR1h4aEI6",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            payment_method,
            metadata,
            return_url,
          },
        },
      }),
    };

    const result = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${payment_intent}/attach`,
      options
    );

    const data = await result.json();

    if (data.errors) {
      return res.json({
        status: 400,
        message: "Error attaching payment",
        data,
      });
    }

    return res.json({
      status: 200,
      message: "Payment attach processing successfully",
      data,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error processing payment attach",
      error,
    });
  }
}
