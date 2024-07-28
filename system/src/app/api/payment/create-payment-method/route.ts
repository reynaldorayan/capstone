import { NextRequest as Req, NextResponse as res } from "next/server";
import {
  createPaymentMethodSchema,
  CreatePaymentMethodSchemaData,
} from "@/vendors/paymongo/schemas";

export async function POST(req: Req) {
  try {
    const formData = await req.formData();

    const dataObj = Object.fromEntries(
      formData.entries()
    ) as CreatePaymentMethodSchemaData;

    console.log(dataObj);

    return res.json({
      status: 200,
      message: "Show data",
      data: dataObj,
    });

    const validation = createPaymentMethodSchema.safeParse(dataObj);

    if (!validation.success) {
      return res.json({
        status: 400,
        message: "Validation error",
        error: validation.error.flatten().fieldErrors,
      });
    }

    const { type, details, metadata } = validation.data;

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
            type,
            details,
            metadata,
          },
        },
      }),
    };

    const result = await fetch(
      "https://api.paymongo.com/v1/payment_methods",
      options
    );

    const data = await result.json();

    if (data.errors) {
      return res.json({
        status: 400,
        message: "Error creating payment method",
        data,
      });
    }

    return res.json({
      status: 200,
      message: "Payment method created successfully",
      data,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error creating payment method",
    });
  }
}
