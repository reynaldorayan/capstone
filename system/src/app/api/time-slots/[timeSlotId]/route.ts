import {
  type NextRequest as Request,
  NextResponse as response,
} from "next/server";

import db, { prismaErrorHandler } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  req: Request,
  { params: { timeSlotId } }: { params: { timeSlotId: string } }
) {
  try {
    const timeSlot = await db.timeSlot.findFirst({
      where: {
        id: timeSlotId,
      },
    });
    return response.json(timeSlot);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
