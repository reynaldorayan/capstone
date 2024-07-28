import db from "@/lib/prisma";
import { Accommodation } from "@prisma/client";
import dayjs from "dayjs";

const uniqueAccommodations = (
  accommodations: Accommodation[]
): Accommodation[] => {
  const seen = new Set<string>();
  return accommodations.filter((accommodation) => {
    if (seen.has(accommodation.id)) {
      return false;
    }
    seen.add(accommodation.id);
    return true;
  });
};

export enum TourType {
  DAY_TOUR = "Day Tour",
  AFTERNOON_TOUR = "Afternoon Tour",
  NIGHT_TOUR = "Night Tour",
  TWENTY_TWO_HOURS_TOUR = "22 Hours Tour",
}

export async function getAvailability(
  accommodationIds: string[],
  checkIn: string,
  checkOut: string,
  timeSlotId: string
): Promise<any> {
  const timeSlot = await db.timeSlot.findUnique({ where: { id: timeSlotId } });

  if (!timeSlot) return [];

  const { startTime, endTime } = timeSlot;

  // Split startTime and endTime to separate hours and minutes
  const t1 = startTime.replace("AM", "").replace("PM", "").trim().split(":");
  const t2 = endTime.replace("AM", "").replace("PM", "").trim().split(":");

  // Determine if startTime and endTime were originally AM or PM
  const isStartPM = startTime.includes("PM");
  const isEndPM = endTime.includes("PM");

  // Set hours and minutes based on the split values and AM/PM determination
  const d1 = dayjs(checkIn)
    .set("hour", Number(t1[0]) + (isStartPM && Number(t1[0]) !== 12 ? 12 : 0)) // Convert 12-hour PM to 24-hour format
    .set("minute", Number(t1[1]));

  const d2 = dayjs(checkOut)
    .set("hour", Number(t2[0]) + (isEndPM && Number(t2[0]) !== 12 ? 12 : 0)) // Convert 12-hour PM to 24-hour format
    .set("minute", Number(t2[1]));

  console.log(
    d1.format("YYYY-MM-DD HH:mm:ss A"),
    d2.format("YYYY-MM-DD HH:mm:ss A")
  );

  let d2a = dayjs(d2, { format: "YYYY-MM-DD HH:mm:ss A" }).toDate();
  let d1a = dayjs(d1, { format: "YYYY-MM-DD HH:mm:ss A" }).toDate();

  let bookedAccommodations = await db.booking.findMany({
    where: {
      timeSlotId,
      checkIn: { lte: d2a },
      checkOut: { gte: d1a },
      status: {
        notIn: ["CANCELLED", "REJECTED", "COMPLETED"],
      },
    },
    include: {
      accommodation: true,
      timeSlot: true,
    },
  });

  let tempAccommodations = [
    ...bookedAccommodations.map((a) => a.accommodation),
  ];

  const bookedAccommodationIds = uniqueAccommodations(
    bookedAccommodations.map((a) => a.accommodation)
  ).map((a) => a.id);

  const isBookedNotPackage = bookedAccommodations.some(
    (a) => !a.accommodation.isPackage
  );

  const isBookedPrivate = bookedAccommodations.some((a) =>
    a.accommodation.name.includes("Private")
  );

  const notBookedAvailableAccommodations = await db.accommodation.findMany({
    where: {
      id: {
        notIn: bookedAccommodationIds,
      },
    },
  });

  /**
   * If booked is not package, then all packages are not available
   *
   */
  if (isBookedNotPackage) {
    // const timeSlotsBooked = bookedAccommodations.map((a) => a.timeSlot.name);

    // if (timeSlotsBooked.includes(TourType.DAY_TOUR)) {
    // } else if (timeSlotsBooked.includes(TourType.AFTERNOON_TOUR)) {
    // } else if (timeSlotsBooked.includes(TourType.NIGHT_TOUR)) {
    // } else if (timeSlotsBooked.includes(TourType.TWENTY_TWO_HOURS_TOUR)) {
    // }

    for (const accommodation of notBookedAvailableAccommodations) {
      if (accommodation.isPackage) {
        tempAccommodations.push(accommodation);
      }
    }
  }

  /**
   * If booked is package, then all packages are not available
   */
  if (!isBookedNotPackage && bookedAccommodations.length > 0) {
    for (const accommodation of notBookedAvailableAccommodations) {
      if (accommodation.isPackage || !accommodation.name.includes("Private")) {
        tempAccommodations.push(accommodation);
      }
    }
  }

  /**
   * If no booked, then all packages are not available
   * If night tour or 22 hours tour, then all packages are not available
   */
  if (bookedAccommodations.length == 0) {
    if (
      timeSlot.name === TourType.NIGHT_TOUR ||
      timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
    ) {
      for (const accommodation of notBookedAvailableAccommodations) {
        if (accommodation.isPackage) {
          tempAccommodations.push(accommodation);
        }
      }
    }
  }

  /**
   * If booked is private, then all private are not available
   */
  if (isBookedPrivate) {
    for (const accommodation of notBookedAvailableAccommodations) {
      const isCombinedPrivate = bookedAccommodations.some((a) =>
        a.accommodation.name.includes("and")
      );

      if (isCombinedPrivate && accommodation.name.includes("Private")) {
        tempAccommodations.push(accommodation);
      }

      if (!isCombinedPrivate && accommodation.name.includes("and")) {
        tempAccommodations.push(accommodation);
      }
    }
  }

  type TrackAccommodation = Accommodation & {
    isOverlap: boolean;
  };

  let trackedAccommodations: TrackAccommodation[] = [];

  for (const accommodationId of accommodationIds) {
    const accommodation = await db.accommodation.findUnique({
      where: { id: accommodationId },
    });

    let isOverlap = false;

    const isBooked = bookedAccommodations.some(
      (ba) => ba.accommodation.id === accommodationId
    );

    isOverlap = isBooked;

    trackedAccommodations.push({ ...accommodation, isOverlap });
  }

  return {
    bookedAccommodations: tempAccommodations,
    trackedAccommodations,
  };
}
