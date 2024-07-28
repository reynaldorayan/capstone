import db from "@/lib/prisma";
import { calculateDaysInRanges, getUniqueStrings } from "@/utils";
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
): Promise<{
  notAvailableAccommodations: Accommodation[];
  availableAccommodations: Accommodation[];
}> {
  const timeSlot = await db.timeSlot.findUnique({ where: { id: timeSlotId } });

  const { startTime, endTime } = timeSlot;

  let isAvailable = true;
  let notAvailableAccommodations: Accommodation[] = [];
  let availableAccommodations: Accommodation[] = [];

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

  for (const accommodationId of accommodationIds) {
    // Check if there are overlapping accommodations
    const overlappingAccommodations = await db.booking.findMany({
      where: {
        accommodationId: accommodationId,
        OR: [
          {
            checkIn: { lte: d2.toDate() },
            checkOut: { gte: d1.toDate() },
          },
        ],
        status: {
          notIn: ["CANCELLED", "REJECTED", "COMPLETED"],
        },
      },
    });

    const isOverlappedAccommodations = overlappingAccommodations.length > 0;

    const accommodation = await db.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (isOverlappedAccommodations) {
      // notAvailableAccommodations.push(accommodation);
      isAvailable = false;
    } else {
      // availableAccommodations.push(accommodation);
    }

    const facilities = await db.aFacility.findMany({
      where: { accommodationId: accommodationId },
    });

    const facilityIds = facilities.map((facility) => facility.facilityId);

    const overlappingAccommodationFacilities = await db.booking.findMany({
      where: {
        OR: [
          {
            checkIn: { lte: d2.toDate() },
            checkOut: { gte: d1.toDate() },
          },
        ],
        status: {
          notIn: ["CANCELLED", "REJECTED", "COMPLETED"],
        },
        accommodation: {
          facilities: {
            some: {
              facilityId: {
                in: facilityIds,
              },
            },
          },
        },
      },
    });

    const isOverlappedAccommodationFacilities =
      overlappingAccommodationFacilities.length > 0;

    if (isOverlappedAccommodationFacilities) {
      notAvailableAccommodations.push(accommodation);
      isAvailable = false;
    } else {
      availableAccommodations.push(accommodation);
    }
  }

  const countDays = calculateDaysInRanges(d1.toDate(), d2.toDate());

  const { name } = timeSlot;

  // const functionHall = await db.accommodation.findFirst({
  //   where: { name: "Function Hall Exclusive Package" },
  // });

  // const functionHallPlus = await db.accommodation.findFirst({
  //   where: { name: "Function Hall Exclusive Package Plus" },
  // });

  // const functionHallId = functionHall.id;
  // const functionHallPlusId = functionHallPlus.id;

  console.log({ countDays });

  if (countDays == 0) {
    console.log("Step A.1");
    if (name === TourType.DAY_TOUR || name === TourType.AFTERNOON_TOUR) {
      console.log("Step A.2");

      // const functionHallPackages = availableAccommodations.filter(
      //   (acc) => acc.id === functionHallId || acc.id === functionHallPlusId
      // );

      // const updated = availableAccommodations.filter(
      //   (acc) => acc.id !== functionHallId && acc.id !== functionHallPlusId
      // );

      // return {
      //   availableAccommodations: uniqueAccommodations(updated),
      //   notAvailableAccommodations: uniqueAccommodations([
      //     ...notAvailableAccommodations,
      //     ...functionHallPackages,
      //   ]),
      // };
    }
  } else if (countDays == 1) {
    console.log("Step B.1");
    if (
      name === TourType.NIGHT_TOUR ||
      name === TourType.TWENTY_TWO_HOURS_TOUR
    ) {
      console.log("Step B.2");
    }
  } else if (countDays > 1) {
    console.log("Step C.1");
    if (name === TourType.TWENTY_TWO_HOURS_TOUR) {
      console.log("Step C.2");
    }
  }

  return {
    availableAccommodations: uniqueAccommodations(availableAccommodations),
    notAvailableAccommodations: uniqueAccommodations(
      notAvailableAccommodations
    ),
  };
}
