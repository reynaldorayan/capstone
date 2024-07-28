import db, { prismaErrorHandler } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse as response } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const timeSlots = await db.timeSlot.findMany();
    return response.json(timeSlots);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
