"use client";

import { useAuth } from "@/components/Providers";
import Button from "@/components/ui/Button";
import { Chip, Divider, Spinner, useDisclosure } from "@nextui-org/react";
import {
    Accommodation,
    Booking as BookingModel,
    TimeSlot,
    BPayment,
} from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, ReactNode, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import Textarea from "@/components/ui/Textarea";
import { fileToBase64, peso } from "@/utils";
import dayjs from "dayjs";
import React from "react";

export type BookingWithRelation = BookingModel & {
    accommodation: Accommodation & {
        rates: {
            rate: number;
            timeSlot: TimeSlot & {};
        }[];
        maxAllowedGuests: {
            guestCount: number;
            timeSlot: TimeSlot & {};
        }[];
        excessGuestCharges: {
            rate: number;
            guestType: "ADULT" | "CHILD" | "PWD";
        }[];
    };
    payments: BPayment[];
    timeSlot: TimeSlot & {};
};

interface Booking extends BookingWithRelation {
    actions?: ReactNode;
}

const columns = [
    { name: "Booking No", field: "bookingNo", sortable: true },
    { name: "Photo", field: "photo", sortable: false },
    { name: "Accommodation", field: "accommodation", sortable: false },
    { name: "Status", field: "status", sortable: false },
    { name: "Actions", field: "actions" },
];

const initialVisibleColumns: string[] = [
    "bookingNo",
    "status",
    "photo",
    "accommodation",
    "actions",
];

export default function Bookings() {
    const user = useAuth();

    const {
        isOpen: showCancelModal,
        onClose: closeCancelModal,
        onOpen: openCancelModal,
    } = useDisclosure();

    const {
        isOpen: showRefundModal,
        onClose: closeRefundModal,
        onOpen: openRefundModal,
    } = useDisclosure();

    const {
        isOpen: showDetailsModal,
        onClose: closeDetailsModal,
        onOpen: openDetailsModal,
    } = useDisclosure();

    const { data: bookings, isLoading: isLoadingBookings } = useSWR<
        BookingWithRelation[]
    >(user ? `/api/bookings/user/${user.id}` : null, (url: string) =>
        axios.get(url).then((res) => res.data)
    );

    const [selectedBooking, setSelectedBooking] =
        useState<BookingWithRelation | null>(null);

    const qrPaymentRef = useRef<HTMLInputElement>(null);
    const [qrPayment, setQrPayment] = useState<string | null>(null);

    const handleChangeQrPayment = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const base64 = await fileToBase64(e.target.files[0]);
        setQrPayment(base64);
    };

    const otherDetails = useMemo(() => {
        if (!selectedBooking) return;

        const accommodationRate = selectedBooking.accommodation.rates.find(
            (rate) => rate.timeSlot.id === selectedBooking.timeSlotId
        ).rate;

        const maxAllowedGuests = Number(
            selectedBooking.accommodation.maxAllowedGuests.find(
                (guest) => guest.timeSlot.id === selectedBooking.timeSlotId
            ).guestCount
        );

        const excessChargePerAdult =
            selectedBooking.accommodation.excessGuestCharges.find(
                (charge) => charge.guestType === "ADULT"
            ).rate;

        const guestCounts =
            Number(selectedBooking.children) +
            Number(selectedBooking.adults) +
            Number(selectedBooking.pwds);

        const excessGuests =
            Number(guestCounts) > maxAllowedGuests
                ? guestCounts - maxAllowedGuests
                : 0;

        const excessCharge = Number(excessGuests) * Number(excessChargePerAdult);

        return {
            checkIn: dayjs(selectedBooking.checkIn).format("MMMM DD YYYY"),
            checkOut: dayjs(selectedBooking.checkOut).format("MMMM DD YYYY"),
            adult: selectedBooking.adults,
            children: selectedBooking.children,
            pwd: selectedBooking.pwds,
            excessCharge: peso(Number(excessCharge)),
            balance: peso(Number(selectedBooking.balance)),
            securityDeposit: peso(Number(selectedBooking.securityDeposit)),
            reservationFee: peso(Number(selectedBooking.reservationFee)),
            totalAmount: peso(Number(selectedBooking.bookingFee)),
            accommodationRate: peso(Number(accommodationRate)),
        };
    }, [selectedBooking]);

    if (isLoadingBookings)
        return (
            <div className="flex justify-center py-6 pt-96">
                <Spinner />
            </div>
        );

    const renderCell = (item: Booking, columnKey: string) => {
        switch (columnKey) {
            case "bookingNo":
                return <div>{item.bookingNo}</div>;
            case "status":
                return (
                    <div className="flex flex-col gap-1">
                        <Chip
                            color={
                                item.status === "PENDING"
                                    ? "primary"
                                    : item.status === "CONFIRMED"
                                        ? "success"
                                        : item.status === "CANCELLED" || item.status === "REJECTED"
                                            ? "danger"
                                            : item.status === "CANCELLATION"
                                                ? "warning"
                                                : "secondary"
                            }
                        >
                            <div className="flex gap-1">
                                {item.status}{" "}
                                {item.status === "REJECTED" && (
                                    <span>- {item.reasonForRejection}</span>
                                )}
                            </div>
                        </Chip>
                        {item.status === "REJECTED" && item.refundReceipt === null && (
                            <span className="text-sm text-cyan-600">
                                Please refund your payment.
                            </span>
                        )}
                    </div>
                );
            case "photo":
                return (
                    <div>
                        <Image
                            src={`/storage/${item.accommodation.photo}`}
                            alt={item.accommodation.name}
                            height={100}
                            width={100}
                            unoptimized
                            priority
                        />
                    </div>
                );
            case "accommodation":
                return <div>{item.accommodation.name}</div>;
            case "actions":
                return (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                setSelectedBooking(item);
                                openDetailsModal();
                            }}
                            color="secondary"
                            className="font-medium"
                        >
                            View Details
                        </Button>
                        {item.status === "REJECTED" ? (
                            <>
                                <Button
                                    onClick={() => {
                                        setSelectedBooking(item);
                                        openRefundModal();
                                    }}
                                    color="danger"
                                    variant="flat"
                                    className="font-medium"
                                >
                                    Refund Payment
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => {
                                        setSelectedBooking(item);
                                        openCancelModal();
                                    }}
                                    color="danger"
                                    className="font-medium"
                                >
                                    Request Cancel
                                </Button>
                            </>
                        )}

                        {(item.status === "REJECTED" && item.refundReceipt == null) ||
                            (item.status === "CANCELLED" && item.refundReceipt == null && (
                                <Button
                                    onClick={() => { }}
                                    color="primary"
                                    variant="flat"
                                    className="font-medium"
                                >
                                    Refund Details
                                </Button>
                            ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen px-4 mt-10 flex flex-col gap-5 sm:container sm:mx-auto">
            <h2 className="text-lg font-medium">My Bookings</h2>
            <Table
                searchPlaceholder="Search booking by booking number..."
                searchColumn="bookingNo"
                columns={columns}
                initialVisibleColumns={initialVisibleColumns}
                data={bookings}
                renderCell={renderCell}
            />

            {selectedBooking && (
                <>
                    <Modal
                        title={`Cancel booking #${selectedBooking.bookingNo}`}
                        isOpen={showCancelModal}
                        onClose={closeCancelModal}
                    >
                        <div className="flex flex-col gap-4">
                            <p>Are you sure you want to cancel this booking?</p>
                            <Textarea placeholder="Reason for cancellation" />

                            <div className="relative">
                                <div>
                                    <h2>Upload your Qr Payment for the refund of your payment</h2>
                                    <p className="text-blue-500 text-sm">
                                        Note: Only InstaPay or QrPH are allowed for the refund
                                    </p>
                                </div>
                                <div className="border-3 border-dashed min-h-56 min-w-full sm:h-96 sm:w-96 cursor-pointer place-items-center grid">
                                    {/* Qr Payment */}
                                    {qrPayment && (
                                        <Image
                                            src={qrPayment}
                                            alt="Front ID"
                                            height={100}
                                            width={100}
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        ref={qrPaymentRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleChangeQrPayment}
                                    />
                                    {!qrPayment && (
                                        <div className="absolute text-lg opacity-20 select-none">
                                            <p>Upload Qr Payment</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    {qrPayment ? (
                                        <Button
                                            size="sm"
                                            className="font-medium mt-2"
                                            color="danger"
                                            onClick={() => {
                                                setQrPayment(null);
                                            }}
                                        >
                                            Remove Qr Payment
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="font-medium mt-2"
                                            color="default"
                                            onClick={() => {
                                                qrPaymentRef.current?.click();
                                            }}
                                        >
                                            Upload Qr Payment
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button color="primary" className="font-medium">
                                    Confirm Cancel
                                </Button>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        title={`Refund payment for booking #${selectedBooking.bookingNo}`}
                        isOpen={showRefundModal}
                        onClose={closeRefundModal}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <div>
                                    <h2>Upload your Qr Payment for the refund of your payment</h2>
                                    <p className="text-blue-500 text-sm">
                                        Note: Only InstaPay or QrPH are allowed for the refund
                                    </p>
                                </div>
                                <div className="border-3 border-dashed min-h-56 min-w-full sm:h-96 sm:w-96 cursor-pointer place-items-center grid">
                                    {/* Qr Payment */}
                                    {qrPayment && (
                                        <Image
                                            src={qrPayment}
                                            alt="Front ID"
                                            height={100}
                                            width={100}
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        ref={qrPaymentRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleChangeQrPayment}
                                    />
                                    {!qrPayment && (
                                        <div className="absolute text-lg opacity-20 select-none">
                                            <p>Upload Qr Payment</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    {qrPayment ? (
                                        <Button
                                            size="sm"
                                            className="font-medium mt-2"
                                            color="danger"
                                            onClick={() => {
                                                setQrPayment(null);
                                            }}
                                        >
                                            Remove Qr Payment
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="font-medium mt-2"
                                            color="default"
                                            onClick={() => {
                                                qrPaymentRef.current?.click();
                                            }}
                                        >
                                            Upload Qr Payment
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    color="primary"
                                    className="font-medium"
                                    isDisabled={selectedBooking.refundReceipt != null}
                                >
                                    Confirm Refund
                                </Button>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        title={`Other details for booking #${selectedBooking.bookingNo}`}
                        isOpen={showDetailsModal}
                        onClose={closeDetailsModal}
                    >
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>
                                    Check-in: {otherDetails.checkIn} &mdash;{" "}
                                    {selectedBooking.timeSlot.startTime}
                                </p>
                                <p>
                                    Check-out: {otherDetails.checkOut} &mdash;{" "}
                                    {selectedBooking.timeSlot.endTime}
                                </p>
                            </div>
                            <div>
                                <p>Number of guests:</p>
                                <p>Adult: {selectedBooking.adults}</p>
                                <p>Children: {selectedBooking.children}</p>
                                <p>Pwd: {selectedBooking.pwds}</p>
                            </div>

                            <div>
                                <p>Accommodation rate: {otherDetails.accommodationRate}</p>
                                <p>Excess charges: {otherDetails.excessCharge}</p>
                            </div>

                            <div>
                                <p>Balance: {otherDetails.balance}</p>

                                <p>Security deposit: {otherDetails.securityDeposit}</p>

                                <p>Reservation Fee: {otherDetails.reservationFee}</p>

                                <p>Total amount: {otherDetails.totalAmount}</p>
                            </div>
                        </div>

                        <Divider />

                        <div>
                            <h2>Payment logs:</h2>

                            <div className="mt-2">
                                {selectedBooking.payments.map((payment) => (
                                    <div>
                                        {peso(Number(payment.amount))} - {payment.paymentOption}{" "}
                                        &mdash; {payment.paymentMethod} &mdash;{" "}
                                        {dayjs(payment.createdAt).format("MMMM DD YYYY")}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
}
