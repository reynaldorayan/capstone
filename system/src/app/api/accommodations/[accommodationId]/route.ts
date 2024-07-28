import {
  type NextRequest as Request,
  NextResponse as response,
} from "next/server";

import db, { prismaErrorHandler } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  req: Request,
  { params: { accommodationId } }: { params: { accommodationId: string } }
) {
  try {
    const accommodations = await db.accommodation.findFirst({
      where: {
        id: accommodationId,
      },
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
        excessGuestCharges: true,
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
