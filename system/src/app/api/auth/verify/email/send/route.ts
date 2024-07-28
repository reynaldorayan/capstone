import db, { prismaErrorHandler } from "@/lib/prisma";
import { sendEmailOtpSchema } from "@/schemas/verification";
import { genOtp } from "@/utils";
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
    const otp = genOtp().toString();

    await db.user.update({
      where: {
        email: data.email,
      },
      data: {
        emailVerificationToken: otp,
        emailVerificationTokenExpiry: dayjs().add(10, "minute").toDate(),
      },
    });

    await sendMail({
      to: data.email,
      subject: "Email Verification",
      message: `Your email verification OTP is ${otp}`,
    });

    return response.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
