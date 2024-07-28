"use client";

import { fetcher } from "@/utils";
import {
  AAmenity,
  Accommodation,
  AExcessGuestCharge,
  AFacility,
  AInclusion,
  AMaxAllowedGuest,
  AMaxExcessGuest,
  Amenity,
  ARate,
  Booking,
  Facility,
  GuestType,
  Inclusion,
  TimeSlot,
} from "@prisma/client";
import pluralize from "pluralize";
import useSWR from "swr";
import AccommodationCard from "./accommodation-card";
import { useEffect, useState } from "react";
import axios from "axios";
import useBookingStore from "@/stores/booking";

export type AccommodationWithRelation = Accommodation & {
  amenities: AAmenity &
  {
    amenity: Amenity;
  }[];
  inclusions: AInclusion &
  {
    inclusion: Inclusion;
  }[];
  facilities: AFacility &
  {
    facility: Facility;
  }[];
  rates: ARate &
  {
    rate: number;
    timeSlot: TimeSlot;
  }[];
  maxAllowedGuests: AMaxAllowedGuest &
  {
    guestCount: number;
    timeSlot: TimeSlot;
  }[];
  maxExcessGuests: AMaxExcessGuest &
  {
    guestCount: number;
    timeSlot: TimeSlot;
  }[];
  excessGuestCharges: AExcessGuestCharge &
  {
    rate: number;
    guestType: GuestType;
  }[];
};

export default function Accommodations() {
  const { startDate, endDate, timeSlotId } = useBookingStore();

  const { data: accommodations, isLoading: isLoadingAccommodations } = useSWR<
    AccommodationWithRelation[]
  >("/api/accommodations", fetcher);

  const [bookedAccommodations, setBookedAccommodations] = useState<
    Accommodation[]
  >([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);

  useEffect(() => {
    async function checkAvailability() {
      if (!startDate || !endDate || !timeSlotId || !accommodations) return;

      const result = await axios.post(
        "/api/check-availability/select-accommodation",
        {
          accommodationIds: accommodations.map(
            (accommodation) => accommodation.id
          ),
          startDate,
          endDate,
          timeSlotId,
        }
      );

      console.log("from api: ", result.data.trackedAccommodations);

      setBookedAccommodations(result.data.bookedAccommodations);
      setIsCheckingAvailability(false);
    }

    checkAvailability();
  }, [startDate, endDate, timeSlotId, accommodations]);

  useEffect(() => {
    console.log("from state: ", { bookedAccommodations });
  }, [bookedAccommodations]);

  if (isLoadingAccommodations) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2 mt-10" id="accommodations-list">
      <div className="w-full px-4 sm:container sm:mx-auto">
        <h1 className="text-2xl font-medium">Our Accommodations</h1>
        <p className="text-blue-500 flex gap-1">Our Facilities</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-5 sm:gap-10">
          {!isLoadingAccommodations &&
            accommodations.map((accommodation) => {
              const isBooked = bookedAccommodations.some(
                (a) => a.id === accommodation.id
              );

              const isGrayScale = isCheckingAvailability
                ? true
                : isBooked;

              return (
                <AccommodationCard
                  isGrayScale={isGrayScale}
                  key={accommodation.id}
                  accommodation={accommodation}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2 mt-10">
      <div className="w-full px-4 sm:container sm:mx-auto">
        <h1 className="text-2xl font-semibold">Accommodations</h1>
        <p className="text-sm text-gray-500">loading accommodations...</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-5 sm:gap-10">
          <Box />
          <Box />
          <Box />
          <Box />
        </div>
      </div>
    </div>
  );
}

export function Box() {
  return (
    <div className="min-h-64 border border-gray-100 shadow-lg flex flex-col sm:flex-row group">
      <div className="w-full min-h-56 sm:sm:w-96 group relative grid place-items-center overflow-hidden">
        <div className="absolute hidden group-hover:block transition-all duration-300 ease-in-out z-50">
          <div className="bg-black bg-opacity-70 text-white font-medium p-2 rounded cursor-pointer">
            360° view
          </div>
        </div>
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      </div>

      <div className="w-full h-full flex flex-col justify-between gap-5 p-5">
        <div className="mt-1 flex flex-col gap-2">
          <div className="w-3/4 h-4 bg-gray-200 animate-pulse" />
          <div className="w-1/2 h-4 bg-gray-200 animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-200 animate-pulse" />
        </div>

        <div className="w-full flex justify-end gap-2">
          <div className="w-1/4 h-8 bg-gray-200 animate-pulse" />
          <div className="w-1/4 h-8 bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
