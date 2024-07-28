import { moveFile } from "@/lib/fileupload";
import db, { prismaErrorHandler } from "@/lib/prisma";
import { createCookieSession } from "@/lib/session";
import { SignupSchema, signupSchema } from "@/schemas/auth";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import dayjs from "dayjs";
import { NextRequest as Request, NextResponse as response } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const data = Object.fromEntries(formData.entries()) as SignupSchema;

  const photo = formData.get("photo");

  if (photo instanceof File) {
    data.photo = {
      originalname: photo.name,
      mimetype: photo.type,
      size: photo.size,
    };
  }

  if (data.dataPrivacyPolicy)
    data.dataPrivacyPolicy = formData.get("dataPrivacyPolicy") === "true";

  if (data.termsAndConditions)
    data.termsAndConditions = formData.get("termsAndConditions") === "true";

  if (data.birthDate) data.birthDate = dayjs(data.birthDate).toDate();

  const validation = signupSchema.safeParse(data);

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
    let avatar: string | null = null;

    if (photo instanceof File) avatar = await moveFile(photo);

    delete data.confirmPassword;

    const user = await db.user.create({
      data: {
        avatar,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        email: data.email,
        mobile: data.mobile,
        username: data.username,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        password: await hash(data.password, 12),
        agreement: {
          create: {
            termsAndConditions: data.termsAndConditions,
            dataPrivacyPolicy: data.dataPrivacyPolicy,
          },
        },
      },
    });

    delete user.password;

    await createCookieSession(user);

    return response.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
    return response.json({ error: error }, { status: 500 });
  }
}
