"use client";

import { CalendarDate, SelectItem, Spinner } from "@nextui-org/react";
import { Controller, useFormContext } from "react-hook-form";
import { calculateDaysInRanges, fetcher } from "@/utils";
import { fromCalendarDateToDate, fromDateToCalendarDate } from "@/lib/dayjs";
import useBookingStore from "@/stores/booking";
import DateInput from "@/components/ui/DateInput";
import { duration, DurationInput } from "@/schemas/booking";
import useSWR from "swr";
import Select from "@/components/ui/Select";
import { TimeSlot } from "@prisma/client";
import pluralize from "pluralize";
import dayjs from "dayjs";
import { useEffect } from "react";
import Availability from "./availability"
import { LuCalendarCheck, LuCalendarX } from "react-icons/lu";

export enum TourType {
  DAY_TOUR = "Day Tour",
  AFTERNOON_TOUR = "Afternoon Tour",
  NIGHT_TOUR = "Night Tour",
  TWENTY_TWO_HOURS_TOUR = "22 Hours Tour",
}

export default function SelectDuration() {
  const {
    startDate,
    endDate,
    timeSlotId,
    setStartDate,
    setEndDate,
    setTimeSlotId,
  } = useBookingStore();

  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<DurationInput>();

  const { data: timeSlots, isLoading: isLoadingTimeslots } = useSWR<TimeSlot[]>(
    "/api/time-slots",
    fetcher
  );

  const countDays = calculateDaysInRanges(
    dayjs(startDate).toDate(),
    dayjs(endDate).toDate()
  );

  useEffect(() => {
    if (startDate && endDate && timeSlotId) {
      const accommodationsList = document.getElementById("accommodations-list");
      if (accommodationsList) {
        accommodationsList.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [startDate, endDate, timeSlotId]);

  if (isLoadingTimeslots) return <div className="flex justify-center">
    <Spinner />
  </div>;

  return (
    <div id="select-duration">
      <div className="px-4">
        <div className="w-full sm:max-w-5xl sm:mx-auto mb-16 border border-gray-50 shadow-lg min-h-16">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="pt-5 ps-5">
              <div className="text-xl font-medium text-gray-800">
                Select Duration{" "}
                <span className="text-sm font-normal">
                  (
                  {pluralize(
                    "day",
                    isNaN(countDays) || countDays < 0 ? 0 : countDays,
                    true
                  )}
                  )
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Set the duration of your stay
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-end sm:flex-row gap-3">
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => {
                      return (
                        <DateInput
                          label="Check-in"
                          error={errors.startDate?.message}
                          value={fromDateToCalendarDate(field.value)}
                          onChange={(value) => {
                            setStartDate(
                              fromCalendarDateToDate(value as CalendarDate)
                            );

                            setEndDate(
                              fromCalendarDateToDate(value as CalendarDate)
                            );

                            field.onChange(
                              fromCalendarDateToDate(value as CalendarDate)
                            );

                            setTimeSlotId(null);
                            setValue("timeSlotId", null);
                          }}
                          endContent={<LuCalendarCheck size={22} className="text-gray-600" />}
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => {
                      return (
                        <DateInput
                          label="Check-out"
                          error={errors.endDate?.message}
                          value={fromDateToCalendarDate(field.value)}
                          onChange={(value) => {
                            setEndDate(
                              fromCalendarDateToDate(value as CalendarDate)
                            );

                            field.onChange(
                              fromCalendarDateToDate(value as CalendarDate)
                            );

                            setTimeSlotId(null);
                            setValue("timeSlotId", null);
                          }}
                          endContent={<LuCalendarX size={22} className="text-gray-600" />}
                        />
                      );
                    }}
                  />

                  <Availability />
                </div>

                <Select
                  label="Time slot"
                  placeholder="Select your preferred time..."
                  error={errors.timeSlotId?.message}
                  {...register("timeSlotId")}
                  selectedKeys={timeSlotId ? [timeSlotId] : []}
                  onChange={(e) => {
                    setTimeSlotId(e.target.value);
                  }}
                >
                  {timeSlots.map((timeSlot) => {
                    const { name } = timeSlot;

                    if (countDays < 0) return null; // Prevent negative days

                    if (countDays == 0) {
                      if (
                        name !== TourType.DAY_TOUR &&
                        name !== TourType.AFTERNOON_TOUR
                      )
                        return null;
                    }

                    if (countDays == 1) {
                      if (
                        name !== TourType.NIGHT_TOUR &&
                        name !== TourType.TWENTY_TWO_HOURS_TOUR
                      )
                        return null;
                    }

                    if (countDays > 1) {
                      if (name !== TourType.TWENTY_TWO_HOURS_TOUR) return null;
                    }

                    return (
                      <SelectItem
                        key={timeSlot.id}
                        textValue={`${timeSlot.name} - ${timeSlot.startTime} to ${timeSlot.endTime}`}
                      >
                        {timeSlot.name} - {timeSlot.startTime} to{" "}
                        {timeSlot.endTime}
                      </SelectItem>
                    );
                  })}
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
