"use client";

import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useBookingStore from "@/stores/booking";
import { bookingFormSchema, BookingFormInput } from "@/schemas/booking";
import { useAuth } from "@/components/Providers";
import { BankCode, PaymentMethod } from "@/vendors/paymongo/types";
import {
  base64ToFile,
  calculateDaysInRanges,
  fetcher,
  fileToBase64,
  peso,
} from "@/utils";
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
  Facility,
  GuestType,
  Inclusion,
  TimeSlot,
} from "@prisma/client";
import useSWR from "swr";
import { SelectItem, Tooltip } from "@nextui-org/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import dayjs from "dayjs";
import Select from "@/components/ui/Select";
import { fromCalendarDateToDate, fromDateToCalendarDate } from "@/lib/dayjs";
import { PaymentStatus } from "@/constants/enums";
import { useRouter } from "next/navigation";

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

export default function BookingForm({
  closeBookingForm,
}: {
  closeBookingForm: () => void;
  openBookingForm: () => void;
}) {
  const router = useRouter()

  const user = useAuth();

  const iFrameRef = useRef<HTMLIFrameElement>(null);

  const {
    startDate,
    endDate,
    timeSlotId,
    accommodationId,
    frontId,
    setFrontId,
    backId,
    setBackId,
    adults,
    setAdults,
    children,
    setChildren,
    pwd,
    setPwd,
    paymentOption,
    setPaymentOption,
    paymentMethod,
    setPaymentMethod,
    bankCode,
    setBankCode,
    cardNumber,
    setCardNumber,
    expMonth,
    setExpMonth,
    expYear,
    setExpYear,
    cvc,
    setCvc,
    bookingFee,
    setBookingFee,
    setPaymentIntentId,
    setPaymentClientKey,
    paymentIntentId,
    paymentClientKey,
    setPaymentNextUrl,
    paymentNextUrl,
    setPaymentStatus,
    paymentStatus,
  } = useBookingStore();

  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    values: {
      startDate: fromCalendarDateToDate(fromDateToCalendarDate(startDate)),
      endDate: fromCalendarDateToDate(fromDateToCalendarDate(endDate)),
      timeSlotId,
      accommodationId,
      frontId,
      backId,
      adults,
      children,
      pwd,
      paymentOption,
      paymentMethod,
      bankCode,
      cardNumber: Number(cardNumber),
      expMonth: Number(expMonth),
      expYear: Number(expYear),
      cvc: Number(cvc),
      bookingFee,
    },
  });

  const frontIdRef = useRef<HTMLInputElement>(null);
  const backIdRef = useRef<HTMLInputElement>(null);

  const handleSelectFileForFrontId = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const base64 = await fileToBase64(e.target.files[0]);
    setValue("frontId", base64);
    setFrontId(base64);
  };

  const handleSelectFileForBackId = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const base64 = await fileToBase64(e.target.files[0]);
    setValue("backId", base64);
    setBackId(base64);
  };

  const [accommodationRateRate, setAccommodationRateRate] = useState(0);
  const [excessChargePerAdultRate, setExcessChargePerAdultRate] = useState(0);

  const [maxAllowedGuests, setMaxAllowedGuests] = useState(0);
  const [maxExcessGuests, setMaxExcessGuests] = useState(0);
  const [excessGuests, setExcessGuests] = useState(0);
  const [guestCounts, setGuestCounts] = useState(0);
  const [excessCharge, setExcessCharge] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [total, setTotal] = useState(0);

  const { data: accommodation, isLoading: isLoadingAccommodation } =
    useSWR<AccommodationWithRelation>(
      accommodationId ? `/api/accommodations/${accommodationId}` : null,
      fetcher
    );

  const { data: timeSlot, isLoading: isLoadingTimeSlot } = useSWR<TimeSlot>(
    timeSlotId ? `/api/time-slots/${timeSlotId}` : null,
    fetcher
  );

  useEffect(() => {
    if (isLoadingAccommodation || !accommodation) return;


    const securityDeposit = Number(accommodation.isPackage ? 3000 : 1000);

    const accommodationRate = accommodation.rates.find(
      (rate) => rate.timeSlot.id === timeSlotId
    ).rate;

    const maxAllowedGuests = Number(
      accommodation.maxAllowedGuests.find(
        (guest) => guest.timeSlot.id === timeSlotId
      ).guestCount
    );

    const maxExcessGuests = Number(
      accommodation.maxExcessGuests.find(
        (guest) => guest.timeSlot.id === timeSlotId
      ).guestCount
    );

    const excessChargePerAdult = accommodation.excessGuestCharges.find(
      (charge) => charge.guestType === "ADULT"
    ).rate;

    const guestCounts = Number(children) + Number(adults) + Number(pwd);

    const excessGuests =
      guestCounts > maxAllowedGuests ? guestCounts - maxAllowedGuests : 0;

    const excessCharge = Number(excessGuests) * Number(excessChargePerAdult);

    const subTotal = Number(accommodationRate) + Number(excessCharge);

    const days = calculateDaysInRanges(
      dayjs(startDate).toDate(),
      dayjs(endDate).toDate()
    );

    const total =
      Number(days >= 2 ? subTotal * days : subTotal) + Number(securityDeposit);

    setAccommodationRateRate(accommodationRate);
    setExcessChargePerAdultRate(excessChargePerAdult);
    setGuestCounts(guestCounts);
    setExcessCharge(excessCharge);
    setExcessGuests(excessGuests);
    setMaxAllowedGuests(maxAllowedGuests);
    setMaxExcessGuests(maxExcessGuests);
    setSecurityDeposit(securityDeposit);
    setTotal(total);
    setBookingFee(total);
  }, [accommodation, isLoadingAccommodation, adults, children, pwd]);

  const [isPreparingPayment, setIsPreparingPayment] = useState(true);

  const hideIframe = () => {
    if (iFrameRef.current) {
      iFrameRef.current.style.display = "none";
    }
  };

  const showIframe = () => {
    if (iFrameRef.current) {
      iFrameRef.current.style.display = "block";
    }
  };

  useEffect(() => {
    if (!paymentNextUrl || !iFrameRef.current) return;

    iFrameRef.current.src = paymentNextUrl;
    iFrameRef.current.style.width = "100%";
    iFrameRef.current.style.height = "800px";
    iFrameRef.current.onload = () => {
      // Check payment status
      window.top.postMessage("3DS-authentication-complete", "*");

      setIsPreparingPayment(false);

      if (
        paymentStatus === PaymentStatus.SUCCEEDED ||
        paymentStatus === PaymentStatus.AWAITING_PAYMENT_METHOD
      ) {
        hideIframe();
      }
    };
  }, [iFrameRef, paymentNextUrl]);

  useEffect(() => {
    const handlePaymentMessage = async (ev: MessageEvent) => {
      if (ev.data === "3DS-authentication-complete") {
        try {
          const response = await fetch(
            `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}?client_key=${paymentClientKey}`,
            {
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                authorization:
                  "Basic c2tfdGVzdF8yUWEycXB1Q0U3eVV5anB0WXlxR1h4aEI6",
              },
            }
          );

          const {
            data: {
              attributes: { status },
            },
          } = await response.json();

          setPaymentStatus(status);

          if (status === "succeeded") {
            Swal.fire({
              title: "Payment Successful",
              validationMessage: "Your payment has been successfully processed",
              icon: "success",
              confirmButtonText: "Close",
            });

            const balanceFee =
              paymentOption === "fullPayment" ? 0 : bookingFee / 2;

            const reservationFee =
              paymentOption === "fullPayment" ? 0 : bookingFee / 2;

            const formData = new FormData();
            formData.append("frontId", await base64ToFile(frontId));
            formData.append("backId", await base64ToFile(backId));

            formData.append("checkIn", startDate.toString());
            formData.append("checkOut", endDate.toString());
            formData.append("userId", user.id);
            formData.append("accommodationId", accommodationId);
            formData.append("timeSlotId", timeSlotId);
            formData.append("adults", adults.toString());
            formData.append("children", children.toString());
            formData.append("pwds", pwd.toString());
            formData.append("bookingFee", bookingFee.toString());
            formData.append("reservationFee", reservationFee.toString());
            formData.append("balance", balanceFee.toString());
            formData.append("securityDeposit", securityDeposit.toString());
            formData.append("paymentIntentId", paymentIntentId.toString());
            formData.append("paymentClientKey", paymentClientKey.toString());
            formData.append("paymentOption", paymentOption.toString());
            formData.append("paymentMethod", paymentMethod.toString());

            await fetch("/api/bookings", {
              method: "POST",
              body: formData,
            });

            resetIfSuccess();

            router.replace('/bookings')

          } else if (status === "awaiting_payment_method") {
            Swal.fire({
              title: "Payment Failed",
              validationMessage: "Your payment has failed",
              icon: "error",
              confirmButtonText: "Close",
            });
            resetIfFailed();
            setIsPreparingPayment(true);
            showIframe();
          } else if (status === "processing") {
            console.log("Processing");
          }
        } catch (error) {
          console.error("Error querying payment intent:", error);
        }
      }
    };

    window.addEventListener("message", handlePaymentMessage, false);

    return () => {
      window.removeEventListener("message", handlePaymentMessage);
    };
  }, [paymentClientKey, paymentIntentId]);

  function resetIfSuccess() {
    setFrontId(null);
    setBackId(null);
    setAdults(0);
    setChildren(0);
    setPwd(0);
    setBookingFee(null);
    resetPaymentDetails();
    hideIframe();
    reset();
    closeBookingForm();
  }

  function resetPaymentDetails() {
    setPaymentOption(null);
    setBankCode(null);
    setPaymentMethod(null);
    setCardNumber(null);
    setExpMonth(null);
    setExpYear(null);
    setCvc(null);

    setPaymentNextUrl(null);
    setPaymentIntentId(null);
    setPaymentClientKey(null);
  }

  function resetIfFailed() {
    resetPaymentDetails();
    hideIframe();
  }

  console.log(errors);

  const onSubmit = async (data: BookingFormInput) => {
    try {
      const paymentMethodOptions = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          authorization: "Basic c2tfdGVzdF8yUWEycXB1Q0U3eVV5anB0WXlxR1h4aEI6",
        },
        body: JSON.stringify({
          data: {
            attributes: {
              type: paymentMethod,
              billing: {
                address: {
                  city: user.city,
                  country: user.country,
                  line1: user.line1,
                  line2: user.line2,
                  postal_code: user.postalCode,
                  state: user.state,
                },
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.mobile,
              },
              details: {
                bank_code: bankCode,
                card_number: cardNumber,
                exp_month: Number(expMonth),
                exp_year: Number(expYear),
                cvc,
              },
              metadata: {
                paymentOption: paymentOption,
                userId: user.id,
              },
            },
          },
        }),
      };

      const paymentMethodResult = await fetch(
        "https://api.paymongo.com/v1/payment_methods",
        paymentMethodOptions
      );

      const {
        data: { id: paymentMethodId },
      } = await paymentMethodResult.json();

      const paymentIntentOptions = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          authorization: "Basic c2tfdGVzdF8yUWEycXB1Q0U3eVV5anB0WXlxR1h4aEI6",
        },
        body: JSON.stringify({
          data: {
            attributes: {
              amount:
                paymentOption == "fullPayment"
                  ? Number(bookingFee.toString().concat("00"))
                  : Number((bookingFee / 2).toString().concat("00")),
              payment_method_allowed: Object.values(PaymentMethod),
              payment_method_options: {
                card: { request_three_d_secure: "any" },
              },
              currency: "PHP",
              capture_type: "automatic",
            },
          },
        }),
      };

      const paymentIntentResult = await fetch(
        "https://api.paymongo.com/v1/payment_intents",
        paymentIntentOptions
      );

      const {
        data: {
          id: paymentIntentId,
          attributes: { client_key },
        },
      } = await paymentIntentResult.json();

      console.log({ client_key });

      if (client_key) {
        setPaymentIntentId(client_key.split("_client")[0]);
        setPaymentClientKey(client_key);
      }

      const paymentAttachmentOptions = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          authorization: "Basic c2tfdGVzdF8yUWEycXB1Q0U3eVV5anB0WXlxR1h4aEI6",
        },
        body: JSON.stringify({
          data: {
            attributes: {
              client_key: client_key,
              payment_method: paymentMethodId,
              return_url: process.env.NEXT_PUBLIC_APP_BASE_URL.concat("/empty"),
            },
          },
        }),
      };

      const paymentAttachResult = await fetch(
        `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`,
        paymentAttachmentOptions
      );

      const {
        data: {
          attributes: {
            status,
            next_action: { redirect },
          },
        },
      } = await paymentAttachResult.json();

      if (status === "awaiting_next_action") {
        if (redirect) {
          setPaymentNextUrl(redirect.url);
          setPaymentStatus(status);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return;
  };

  useEffect(() => {
    return () => {
      setPaymentStatus(null);
    };
  }, []);

  if (isLoadingAccommodation || isLoadingTimeSlot) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 my-5">
          <h2 className="text-lg font-medium">Guest Details</h2>

          {/* START GUEST DETAILS */}
          <div className="grid grid-cols-1 w-full gap-16">
            <div className="flex flex-col gap-3">
              <h2 className="font-medium">Personal Information</h2>
              {user && (
                <div className="flex flex-col gap-2">
                  <div>
                    {user.lastName} {user.firstName}
                  </div>
                  <div>
                    <div>
                      {user.line1}, {user.line2}, {user.city}
                    </div>
                    <div>
                      {user.state}, {user.country}, {user.postalCode}
                    </div>
                  </div>
                  <div>{user.email}</div>
                  <div>{user.mobile}</div>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-5 sm:mt-0">
                <h2 className="text-sm font-semibold tracking-wide">
                  Valid ID
                </h2>

                <div className="flex flex-col gap-14 sm:gap-0">
                  <Tooltip
                    content="Attach a photo of the front side of your valid ID"
                    color="foreground"
                  >
                    <div className="relative">
                      <div className="border-3 border-dashed h-full w-full sm:h-56 sm:w-96 cursor-pointer place-items-center grid">
                        {/* Front */}
                        {frontId && (
                          <Image
                            src={frontId}
                            alt="Front ID"
                            height={100}
                            width={100}
                            className="object-cover w-full h-full"
                          />
                        )}
                        <input
                          type="file"
                          ref={frontIdRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleSelectFileForFrontId}
                        />
                        {!frontId && (
                          <div className="absolute text-lg opacity-20 select-none">
                            Front of ID Card
                          </div>
                        )}
                      </div>
                      {frontId ? (
                        <Button
                          size="sm"
                          className="font-medium mt-2"
                          color="danger"
                          onClick={() => {
                            setFrontId(null);
                            setValue("frontId", null);
                          }}
                        >
                          Remove Front ID
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          className="font-medium mt-2"
                          color="primary"
                          onClick={() => {
                            frontIdRef.current?.click();
                          }}
                        >
                          Upload Front ID
                        </Button>
                      )}

                      <p className="text-red-600 text-sm mt-2">
                        {errors.frontId?.message}
                      </p>
                    </div>
                  </Tooltip>
                  <Tooltip
                    content="Attach a photo of the back side of your valid ID"
                    color="foreground"
                  >
                    <div className="relative">
                      <div className="border-3 border-dashed h-full w-full sm:h-56 sm:w-96 cursor-pointer place-items-center grid">
                        {/* Back */}
                        {backId && (
                          <Image
                            src={backId}
                            alt="Front ID"
                            height={100}
                            width={100}
                            className="object-cover w-full h-full"
                          />
                        )}
                        <input
                          type="file"
                          ref={backIdRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleSelectFileForBackId}
                        />
                        {!backId && (
                          <div className="absolute text-lg opacity-20 select-none">
                            Back of ID Card
                          </div>
                        )}
                      </div>

                      {backId ? (
                        <Button
                          size="sm"
                          className="font-medium mt-2"
                          color="danger"
                          onClick={() => {
                            setBackId(null);
                            setValue("backId", null);
                          }}
                        >
                          Remove Back ID
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          className="font-medium mt-2"
                          color="primary"
                          onClick={() => {
                            backIdRef.current?.click();
                          }}
                        >
                          Upload Back ID
                        </Button>
                      )}

                      <p className="text-red-600 text-sm mt-2">
                        {errors.backId?.message}
                      </p>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="font-medium">Number of Guests</h2>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-10">
                  <p className="text-sm">
                    <span className="font-medium">Max Allowed Guests:</span>{" "}
                    {maxAllowedGuests} pax
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Max Excess Guests:</span>{" "}
                    {maxExcessGuests} pax
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    type="number"
                    min={0}
                    label="Adults"
                    {...register("adults", { valueAsNumber: true })}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    error={errors.adults?.message}
                  />

                  <Input
                    type="number"
                    min={0}
                    label="Children"
                    {...register("children", { valueAsNumber: true })}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    error={errors.children?.message}
                  />

                  <Input
                    type="number"
                    min={0}
                    label="Pwds"
                    {...register("pwd", { valueAsNumber: true })}
                    onChange={(e) => setPwd(Number(e.target.value))}
                    error={errors.pwd?.message}
                  />
                </div>

                <div className="flex flex-col mt-2">
                  {guestCounts > maxAllowedGuests + maxExcessGuests && (
                    <p className="text-red-600 text-sm mt-5">
                      You have exceeded the maximum number of guests allowed
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* END GUEST DETAILS */}

          <h2 className="text-lg font-medium">Booking Details</h2>

          {/* START BOOKING DETAILS */}
          <div>
            <div>
              <p>
                <span>Accommodation:</span> {accommodation.name}
              </p>
              <p>
                Check-in: {dayjs(startDate).format("MMMM DD, YYYY")} -{" "}
                {timeSlot.startTime}
              </p>
              <p>
                Check-out: {dayjs(endDate).format("MMMM DD, YYYY")} -{" "}
                {timeSlot.endTime}
              </p>
            </div>

            <div className="mt-5">
              <div className="flex flex-col gap-1 mt-2">
                <p>Number of Guests: {guestCounts} pax</p>

                <div className="flex flex-col gap-1">
                  <p>Accommodation Rate: {peso(accommodationRateRate)}</p>
                  <p>
                    Excess Charges: {excessGuests} x{" "}
                    {peso(excessChargePerAdultRate)} = {peso(excessCharge)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* END BOOKING DETAILS */}

          <h2 className="text-lg font-medium">Payment Details</h2>

          {/* START PAYMENT DETAILS */}
          <div className="flex flex-col gap-5">
            <Controller
              control={control}
              name="paymentOption"
              render={({ field }) => {
                return (
                  <Select
                    classNames={{
                      label: "text-base",
                    }}
                    placeholder="Select payment option"
                    label="Select payment option"
                    error={errors.paymentOption?.message}
                    selectedKeys={[field.value]}
                    value={field.value}
                    onChange={(e) => {
                      setPaymentOption(e.target.value);
                      field.onChange(e.target.value);
                    }}
                  >
                    <SelectItem key="fullPayment" textValue="Full Payment">
                      Full Payment
                    </SelectItem>
                    <SelectItem
                      key="partialPayment"
                      textValue="Partial Payment"
                    >
                      Partial Payment
                    </SelectItem>
                  </Select>
                );
              }}
            />

            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => {
                const description = (method: string): string =>
                  method == "card"
                    ? "Visa or Mastercard accepted"
                    : method == "gcash"
                      ? "GCash wallet"
                      : method == "paymaya"
                        ? "PayMaya wallet"
                        : method == "dob"
                          ? "BPI or UBP accepted"
                          : "";

                const textValue = (method: string): string =>
                  method == "card"
                    ? "Credit / Debit Card"
                    : method == "gcash"
                      ? "GCash"
                      : method == "paymaya"
                        ? "PayMaya"
                        : method == "dob"
                          ? "Direct Online Banking"
                          : "";

                return (
                  <Select
                    placeholder="Select payment method"
                    label="Payment Method"
                    selectedKeys={[field.value]}
                    disabledKeys={["card"]}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setPaymentMethod(e.target.value as PaymentMethod);
                      setBankCode(null);
                      setCardNumber(null);
                      setExpMonth(null);
                      setExpYear(null);
                      setCvc(null);
                    }}
                    value={field.value}
                    error={errors.paymentMethod?.message}
                  >
                    {Object.values(PaymentMethod).map((method) => (
                      <SelectItem
                        key={method}
                        textValue={textValue(method)}
                        description={description(method)}
                      >
                        {textValue(method)}
                      </SelectItem>
                    ))}
                  </Select>
                );
              }}
            />

            <div>
              {paymentMethod === PaymentMethod.CARD ? (
                <div className="flex flex-col gap-3">
                  <Input
                    label="Card number"
                    type="number"
                    {...register("cardNumber", { valueAsNumber: true })}
                    onChange={(e) => setCardNumber(e.target.value)}
                    error={errors.cardNumber?.message}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Exp month"
                      type="number"
                      {...register("expMonth", { valueAsNumber: true })}
                      onChange={(e) => setExpMonth(e.target.value)}
                      error={errors.expMonth?.message}
                      min={0}
                      defaultValue="0"
                    />
                    <Input
                      label="Exp year"
                      type="number"
                      {...register("expYear", { valueAsNumber: true })}
                      onChange={(e) => setExpYear(e.target.value)}
                      error={errors.expYear?.message}
                      min={0}
                      defaultValue="0"
                    />
                    <Input
                      label="CVC"
                      type="number"
                      {...register("cvc", { valueAsNumber: true })}
                      onChange={(e) => setCvc(e.target.value)}
                      error={errors.cvc?.message}
                      min={0}
                      defaultValue="0"
                    />
                  </div>
                </div>
              ) : null}

              {paymentMethod === PaymentMethod.DOB ? (
                <div>
                  <Controller
                    control={control}
                    name="bankCode"
                    render={({ field }) => {
                      return (
                        <Select
                          placeholder="Select a bank to proceed with the payment"
                          label="Direct Online Banking"
                          error={errors.bankCode?.message}
                          value={field.value}
                          selectedKeys={[field.value]}
                          onChange={(e) => {
                            const selectedBankCode = e.target.value as BankCode;
                            field.onChange(selectedBankCode);
                            setBankCode(selectedBankCode);
                          }}
                        >
                          {Object.values(BankCode).map((bankCode) => (
                            <SelectItem
                              key={bankCode}
                              textValue={
                                bankCode == BankCode.BPI ? "BPI" : "UBP"
                              }
                              description={
                                bankCode == BankCode.BPI
                                  ? "Bank of the Philippine Islands"
                                  : "UnionBank of the Philippines"
                              }
                            >
                              {bankCode == BankCode.BPI ? "BPI" : "UBP"}
                            </SelectItem>
                          ))}
                        </Select>
                      );
                    }}
                  />
                </div>
              ) : null}
            </div>

            {paymentOption === "fullPayment" && (
              <div className="flex flex-col gap-3">
                <h2>Full payment details</h2>
                <div className="flex flex-col gap-2">
                  <div>
                    <h3>Balance: {peso(0)}</h3>
                    <h3 className="flex gap-2">
                      <span>Security Deposit: {peso(securityDeposit)}</span>
                    </h3>
                    <h3 className="text-lg font-medium">
                      Booking Fee: {peso(bookingFee)}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {paymentOption === "partialPayment" && (
              <div className="flex flex-col gap-3">
                <h2>Partial payment details</h2>
                <div className="flex flex-col gap-2">
                  <div>
                    <h3>Booking Fee: {peso(bookingFee)}</h3>
                    <h3 className="flex gap-2">
                      <span>Security Deposit: {peso(securityDeposit)}</span>
                    </h3>
                    <h3>Balance: {peso(bookingFee / 2)}</h3>
                    <h3 className="text-lg font-medium">
                      Reservation Fee: {peso(bookingFee / 2)}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* END PAYMENT DETAILS */}
        </div>

        {paymentStatus !== PaymentStatus.AWAITING_PAYMENT_METHOD ? (
          <iframe ref={iFrameRef} height={0}></iframe>
        ) : null}

        {paymentStatus === null ? (
          <Button
            type="submit"
            isDisabled={guestCounts > maxAllowedGuests + maxExcessGuests}
          >
            Confirm and pay
          </Button>
        ) : null}

        {paymentStatus === PaymentStatus.AWAITING_PAYMENT_METHOD ? (
          <Button type="submit">Re-payment</Button>
        ) : null}
      </form>
    </div>
  );
}
