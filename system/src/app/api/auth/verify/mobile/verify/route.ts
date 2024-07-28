import db, { prismaErrorHandler } from "@/lib/prisma";
import { createCookieSession } from "@/lib/session";
import { sendMobileOtpSchema } from "@/schemas/verification";
import { sendMail } from "@/vendors/nodemailer";
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
    const verification = await db.user.findFirst({
      where: {
        mobile: data.mobile,
        mobileVerificationToken: data.otp,
      },
    });

    if (!verification) {
      return response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (dayjs().isAfter(verification.mobileVerificationTokenExpiry)) {
      return response.json({ error: "OTP expired" }, { status: 400 });
    }

    const user = await db.user.update({
      where: {
        mobile: verification.mobile,
      },
      data: {
        mobileVerificationToken: null,
        mobileVerificationTokenExpiry: null,
        mobileVerifiedAt: dayjs().toDate(),
      },
    });

    await createCookieSession(user);

    await sendSms(user.mobile, "Mobile number verified successfully");

    return response.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
