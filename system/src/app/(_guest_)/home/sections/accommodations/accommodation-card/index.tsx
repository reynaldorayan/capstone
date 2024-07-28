"use client";

import { useEffect, useState } from "react";
import { AccommodationWithRelation } from "..";
import Image from "next/image";
import { cn, delay, peso } from "@/utils";
import Button from "@/components/ui/Button";
import { useDisclosure } from "@nextui-org/react";
import Modal from "@/components/ui/modal";
import { useFormContext } from "react-hook-form";
import useBookingStore from "@/stores/booking";
import { useAuth } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import BookingForm from "./booking-form";
import { Role } from "@prisma/client";

type Props = {
  accommodation: AccommodationWithRelation;
  isGrayScale: boolean;
};

export default function AccommodationCard({
  accommodation,
  isGrayScale,
}: Props) {
  const router = useRouter();

  const { setAccommodationId } = useBookingStore((state) => state);

  const {
    isOpen: showVirtualTour,
    onClose: closeVirtualTour,
    onOpen: openVirtualTour,
  } = useDisclosure();

  const {
    isOpen: showDetails,
    onClose: closeDetails,
    onOpen: openDetails,
  } = useDisclosure();

  const {
    isOpen: showBookingForm,
    onClose: closeBookingForm,
    onOpen: openBookingForm,
  } = useDisclosure();

  const maxExcessGuests = accommodation.maxExcessGuests.filter(
    (meg) => meg.guestCount > 0
  );

  const maxAllowedGuests = accommodation.maxAllowedGuests.filter(
    (mag) => mag.guestCount > 0
  );

  const rates = accommodation.rates.filter(({ rate }) => rate > 0);

  const minRate = Math.min(...rates.map(({ rate }) => rate));
  const maxRate = Math.max(...rates.map(({ rate }) => rate));

  const {
    formState: { isValid },
  } = useFormContext();

  const user = useAuth();

  const handleBookNow = async () => {
    if (!user) {
      const toastId = toast.error("Please login to book this accommodation.", {
        id: "login",
      });

      await delay(2000);

      toast.dismiss(toastId);

      router.push("/auth/login");

      return;
    }

    const selectDuration = document.getElementById("select-duration");

    setAccommodationId(accommodation.id);

    if (isValid) {
      openBookingForm();

      if (selectDuration) selectDuration.classList.remove("pt-20");
    } else {
      if (selectDuration) {
        selectDuration.classList.add("pt-20");
        selectDuration.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={cn(
        "min-h-64 border border-gray-100 shadow-lg flex flex-col sm:flex-row group",
        {
          "filter grayscale": isGrayScale,
        }
      )}
    >
      <div className="w-full min-h-56 sm:sm:w-96 group relative grid place-items-center overflow-hidden">
        <div className="absolute hidden group-hover:block transition-all duration-300 ease-in-out z-50">
          <div
            className="bg-black bg-opacity-70 text-white font-medium p-2 rounded cursor-pointer"
            onClick={openVirtualTour}
          >
            360° view
          </div>
        </div>
        <Image
          className="w-full h-full object-cover group-hover:scale-150 transition-transform ease-in-out duration-300"
          src={`/storage/${accommodation.photo}`}
          alt={accommodation.name}
          height={100}
          width={100}
          unoptimized
          priority
        />
      </div>

      <div className="w-full h-full flex flex-col justify-between gap-5 p-5">
        <div className="mt-1 flex flex-col gap-2">
          <h2 className="text-lg font-medium">{accommodation.name}</h2>
          <p>{accommodation.description}</p>
          <p>
            Price ranges {peso(minRate)} to {peso(maxRate)}
          </p>
        </div>

        <div className="w-full flex justify-end gap-2">
          <Button
            className="font-medium"
            color="secondary"
            onClick={openDetails}
            isDisabled={isGrayScale}
          >
            View details
          </Button>

          {user === null || (user && user.role === Role.USER) ? (
            <Button
              type="submit"
              onClick={handleBookNow}
              className="font-medium"
              isDisabled={isGrayScale}
            >
              Book now
            </Button>
          ) : null}
        </div>
      </div>

      <Modal
        size="5xl"
        isOpen={showDetails}
        onClose={closeDetails}
        title={accommodation.name}
      >
        <p>
          Facilities:{" "}
          {accommodation.facilities.map((f) => f.facility.name).join(", ")}
        </p>

        <p>{accommodation.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ul className="list-disc">
            {accommodation.inclusions.map((i) => {
              return (
                <li className="ms-5" key={i.inclusion.id}>
                  {i.inclusion.name}
                </li>
              );
            })}
          </ul>
          <ul className="list-disc">
            {accommodation.amenities.map((a) => {
              return (
                <li className="ms-5" key={a.amenity.id}>
                  {a.amenity.name}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3>Max Allowed Guests</h3>
          <ul className="list-disc">
            {maxAllowedGuests.map((mag) => {
              return (
                <li className="ms-5" key={mag.timeSlot.id}>
                  {mag.guestCount} guests for {mag.timeSlot.name} &mdash;{" "}
                  {mag.timeSlot.startTime} to {mag.timeSlot.endTime}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3>Max Excess Guests</h3>
          <ul className="list-disc">
            {maxExcessGuests.length == 0 ? (
              <li className="ms-5">
                No excess guests allowed for this accommodation.&nbsp;
                <span className="text-gray-500 text-sm">
                  (Please book another accommodation if you have more guests)
                </span>
              </li>
            ) : (
              maxExcessGuests.map((mag) => {
                return (
                  <li className="ms-5" key={mag.timeSlot.id}>
                    {mag.guestCount} guests for {mag.timeSlot.name} &mdash;{" "}
                    {mag.timeSlot.startTime} to {mag.timeSlot.endTime}
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div>
          <h3>Rates</h3>
          <ul className="list-disc">
            {rates.map((r) => {
              return (
                <li className="ms-5" key={r.timeSlot.id}>
                  {peso(r.rate)} for {r.timeSlot.name} &mdash;{" "}
                  {r.timeSlot.startTime} to {r.timeSlot.endTime}
                </li>
              );
            })}
          </ul>
        </div>
      </Modal>

      <Modal
        size="full"
        isOpen={showVirtualTour}
        onClose={closeVirtualTour}
        title={accommodation.name}
      >
        <iframe
          className="ku-embed h-full w-full"
          allow="xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
          src={accommodation.virtualTour}
        ></iframe>
      </Modal>

      <Modal
        size="3xl"
        isOpen={showBookingForm}
        onClose={closeBookingForm}
        title={`Book ${accommodation.name}`}
      >
        <BookingForm
          closeBookingForm={closeBookingForm}
          openBookingForm={openBookingForm}
        />
      </Modal>

      <Toaster position="top-center" />
    </div>
  );
}
