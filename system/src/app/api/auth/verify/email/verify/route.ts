import db, { prismaErrorHandler } from "@/lib/prisma";
import { createCookieSession } from "@/lib/session";
import { sendEmailOtpSchema } from "@/schemas/verification";
import { sendMail } from "@/vendors/nodemailer";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest as Request, NextResponse as response } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const validation = sendEmailOtpSchema.safeParse(data);

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
        email: data.email,
        emailVerificationToken: data.otp,
      },
    });

    if (!verification) {
      return response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (dayjs().isAfter(verification.emailVerificationTokenExpiry)) {
      return response.json({ error: "OTP expired" }, { status: 400 });
    }

    const user = await db.user.update({
      where: {
        email: verification.email,
      },
      data: {
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
        emailVerifiedAt: dayjs().toDate(),
      },
    });

    await createCookieSession(user);

    await sendMail({
      to: user.email,
      subject: "Email Verified",
      message: `Your email has been verified.`,
    });

    return response.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
