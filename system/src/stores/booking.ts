"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface BookingState {
  startDate: Date | null;
  setStartDate: (date: Date) => void;
  endDate: Date | null;
  setEndDate: (date: Date) => void;
  timeSlotId: string | null;
  setTimeSlotId: (id: string) => void;
  accommodationId: string | null;
  setAccommodationId: (id: string) => void;

  frontId: string | null;
  setFrontId: (id: string) => void;
  backId: string | null;
  setBackId: (id: string) => void;

  adults: number;
  setAdults: (adults: number) => void;
  children: number;
  setChildren: (children: number) => void;
  pwd: number;
  setPwd: (pwd: number) => void;

  paymentOption: string | null;
  setPaymentOption: (option: string) => void;
  paymentMethod: string | null;
  setPaymentMethod: (method: string) => void;
  bankCode: string | null;
  setBankCode: (code: string) => void;
  cardNumber: string | null;
  setCardNumber: (number: string) => void;
  expMonth: string | null;
  setExpMonth: (month: string) => void;
  expYear: string | null;
  setExpYear: (year: string) => void;
  cvc: string | null;
  setCvc: (cvc: string) => void;

  bookingFee: number;
  setBookingFee: (fee: number) => void;

  paymentIntentId: string | null;
  setPaymentIntentId: (id: string) => void;
  paymentClientKey: string | null;
  setPaymentClientKey: (key: string) => void;
  paymentNextUrl: string | null;
  setPaymentNextUrl: (url: string) => void;

  paymentStatus: string | null;
  setPaymentStatus: (status: string) => void;
}

const useBookingStore = create<BookingState>()(
  devtools(
    persist(
      (set) => ({
        startDate: null,
        setStartDate: (date: Date) => set({ startDate: date }),
        endDate: null,
        setEndDate: (date: Date) => set({ endDate: date }),
        timeSlotId: null,
        setTimeSlotId: (id: string) => set({ timeSlotId: id }),
        accommodationId: null,
        setAccommodationId: (id: string) => set({ accommodationId: id }),

        frontId: null,
        setFrontId: (id: string) => set({ frontId: id }),
        backId: null,
        setBackId: (id: string) => set({ backId: id }),

        adults: 0,
        setAdults: (adults: number) => set({ adults }),
        children: 0,
        setChildren: (children: number) => set({ children }),
        pwd: 0,
        setPwd: (pwd: number) => set({ pwd }),

        paymentOption: null,
        setPaymentOption: (option: string) => set({ paymentOption: option }),
        paymentMethod: null,
        setPaymentMethod: (method: string) => set({ paymentMethod: method }),
        bankCode: null,
        setBankCode: (code: string) => set({ bankCode: code }),
        cardNumber: null,
        setCardNumber: (number: string) => set({ cardNumber: number }),
        expMonth: null,
        setExpMonth: (month: string) => set({ expMonth: month }),
        expYear: null,
        setExpYear: (year: string) => set({ expYear: year }),
        cvc: null,
        setCvc: (cvc: string) => set({ cvc: cvc }),

        bookingFee: 0,
        setBookingFee: (fee: number) => set({ bookingFee: fee }),

        paymentIntentId: null,
        setPaymentIntentId: (id: string) => set({ paymentIntentId: id }),
        paymentClientKey: null,
        setPaymentClientKey: (key: string) => set({ paymentClientKey: key }),
        paymentNextUrl: null,
        setPaymentNextUrl: (url: string) => set({ paymentNextUrl: url }),

        paymentStatus: null,
        setPaymentStatus: (status: string) => set({ paymentStatus: status }),
      }),
      { name: "bookingStore" }
    )
  )
);

export default useBookingStore;
