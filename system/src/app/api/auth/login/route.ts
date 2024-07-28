import prisma, { prismaErrorHandler } from "@/lib/prisma";
import { createCookieSession } from "@/lib/session";
import { loginSchema } from "@/schemas/auth";
import { Prisma } from "@prisma/client";
import { compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { NextRequest as Request, NextResponse as response } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const validation = loginSchema.safeParse(data);

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
    const user = await prisma.user.findUnique({
      where: { username: data.username, role: "USER" },
    });

    if (!user) {
      return response.json(
        {
          error: {
            username: ["Invalid credentials"],
          },
        },
        {
          status: 400,
        }
      );
    }

    if (!(await compare(data.password, user.password))) {
      return response.json(
        {
          error: {
            password: ["Invalid credentials"],
          },
        },
        {
          status: 400,
        }
      );
    }

    delete user.password;

    await createCookieSession(user);

    return response.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
