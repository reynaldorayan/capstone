import db, { prismaErrorHandler } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse as response } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accommodations = await db.accommodation.findMany({
      include: {
        facilities: {
          include: {
            facility: true,
          },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
        inclusions: {
          include: {
            inclusion: true,
          },
        },
        maxAllowedGuests: {
          include: {
            timeSlot: true,
          },
        },
        maxExcessGuests: {
          include: {
            timeSlot: true,
          },
        },
        rates: {
          include: {
            timeSlot: true,
          },
        },
      },
    });
    return response.json(accommodations);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
