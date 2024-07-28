import db, { prismaErrorHandler } from "@/lib/prisma";
import { calculateDaysInRanges } from "@/utils";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { type NextRequest, NextResponse as response } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { startDate, endDate, timeSlotId } = await req.json();

    if (!startDate || !endDate || !timeSlotId) {
      return response.json(
        {
          error: "Invalid request",
        },
        { status: 400 }
      );
    }

    const availability = await checkAvailability(
      startDate,
      endDate,
      timeSlotId
    );

    return response.json(availability);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
    console.error(error);
  }
}

async function checkAvailability(
  checkIn: string,
  checkOut: string,
  timeSlotId: string
) {
  const checkInDate = dayjs(checkIn).toDate();
  const checkOutDate = dayjs(checkOut).toDate();

  const getAccommodations = await db.accommodation.findMany({
    include: {
      rates: {
        where: {
          timeSlotId,
          rate: {
            gt: 0,
          },
        },
      },
    },
  });

  const accommodations = getAccommodations.filter((a) => a.rates.length > 0);

  return {
    accommodations,
  };
}
