import db, { prismaErrorHandler } from "@/lib/prisma";
import { sendMobileOtpSchema } from "@/schemas/verification";
import { genOtp } from "@/utils";
import { sendSms } from "@/vendors/semaphore";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest as Request, NextResponse as response } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const validation = sendMobileOtpSchema.safeParse(data);

  if (validation.error) {
    return response.json(
      {
        error: validation.error.flatten().fieldErrors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const otp = genOtp().toString();

    await db.user.update({
      where: {
        mobile: data.mobile,
      },
      data: {
        mobileVerificationToken: otp,
        mobileVerificationTokenExpiry: dayjs().add(10, "minute").toDate(),
      },
    });

    await sendSms(data.mobile, `Your mobile verification code is ${otp}`);

    return response.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
