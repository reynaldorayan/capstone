import db, { prismaErrorHandler } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse as response } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const validation = z.array(z.string().uuid()).safeParse(data);

    if (!validation.success) {
      return response.json(
        {
          error: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await db.booking.findMany();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
    console.error(error);
  }
}
