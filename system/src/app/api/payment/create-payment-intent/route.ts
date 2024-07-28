import { NextRequest as Req, NextResponse as res } from "next/server";
import { PaymentMethod } from "@/vendors/paymongo/types";

export async function POST(req: Req) {
  try {
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
            amount: 2000,
            payment_method_allowed: Object.values(PaymentMethod),
            payment_method_options: { card: { request_three_d_secure: "any" } },
            currency: "PHP",
            capture_type: "automatic",
          },
        },
      }),
    };

    const result = await fetch(
      "https://api.paymongo.com/v1/payment_intents",
      options
    );

    const data = await result.json();

    if (data.errors) {
      return res.json({
        status: 400,
        message: "Error creating payment intent",
        data,
      });
    }

    return res.json({
      status: 200,
      message: "Payment intent created successfully",
      data,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error creating payment intent",
      error,
    });
  }
}
