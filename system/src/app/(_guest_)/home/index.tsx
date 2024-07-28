"use client";

import { FormProvider, useForm } from "react-hook-form";
import Accommodations from "./sections/accommodations";
import Hero from "./sections/hero";
import SelectDuration from "./sections/select-duration";
import { zodResolver } from "@hookform/resolvers/zod";
import { DurationInput, duration } from "@/schemas/booking";
import useBookingStore from "@/stores/booking";
import { fromCalendarDateToDate, fromDateToCalendarDate } from "@/lib/dayjs";

export default function Home() {
  const { startDate, endDate, timeSlotId, accommodationId } = useBookingStore();

  const methods = useForm<DurationInput>({
    resolver: zodResolver(duration),
    values: {
      startDate: fromCalendarDateToDate(fromDateToCalendarDate(startDate)),
      endDate: fromCalendarDateToDate(fromDateToCalendarDate(endDate)),
      timeSlotId,
      accommodationId,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = async (data: DurationInput) => {
    if (!isValid) return;
    console.log('booking:', data);
  };

  return (
    <>
      <Hero />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SelectDuration />
          <Accommodations />
        </form>
      </FormProvider>
    </>
  );
}
