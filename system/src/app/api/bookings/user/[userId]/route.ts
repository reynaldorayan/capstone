import db, { prismaErrorHandler } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest as Request, NextResponse as response } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const bookings = await db.booking.findMany({
      where: {
        userId: params.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        payments: true,
        accommodation: {
          include: {
            rates: {
              include: {
                timeSlot: true,
              },
            },
            maxAllowedGuests: {
              include: {
                timeSlot: true,
              },
            },
            excessGuestCharges: true,
          },
        },
        timeSlot: true,
      },
    });

    return response.json(bookings);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
