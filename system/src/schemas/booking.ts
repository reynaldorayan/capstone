import { PaymentMethod } from "@/vendors/paymongo/types";
import dayjs from "dayjs";
import { z } from "zod";

const today = dayjs().startOf("day");
const endOfYear = dayjs().endOf("year");

export const duration = z.object({
  startDate: z.date({
    required_error: "Check in date is required",
    invalid_type_error: "Check in date is required",
  }),
  // .refine((date) => dayjs(date).isAfter(today), {
  //   message: "Check-in date must be greater than today",
  // })
  // .refine((date) => dayjs(date).isBefore(endOfYear), {
  //   message: "Check-in date must be less than the end of this year",
  // })
  endDate: z.date({
    required_error: "Check out date is required",
    invalid_type_error: "Check out date is required",
  }),
  // .refine((date) => dayjs(date).isAfter(today), {
  //   message: "Check-out date must be greater than today",
  // })
  // .refine((date) => dayjs(date).isBefore(endOfYear), {
  //   message: "Check-out date must be less than the end of this year",
  // })
  timeSlotId: z
    .string({
      required_error: "Time slot is required",
      invalid_type_error: "Time slot is required",
    })
    .uuid({
      message: "Time slot is required",
    }),
  accommodationId: z
    .string({
      required_error: "Accommodation is required",
      invalid_type_error: "Accommodation is required",
    })
    .uuid({
      message: "Accommodation is required",
    }),
});

export type DurationInput = z.infer<typeof duration>;

export const guestDetails = z.object({
  frontId: z
    .string({
      required_error: "Front ID is required",
      invalid_type_error: "Front ID is required",
    })
    .min(10, {
      message: "Front ID is required",
    }),
  backId: z
    .string({
      required_error: "Back ID is required",
      invalid_type_error: "Back ID is required",
    })
    .min(10, {
      message: "Back ID is required",
    }),
  adults: z
    .number({
      invalid_type_error: "Guest count is required",
    })
    .min(1, {
      message: "At least one adult is required",
    }),
  children: z.number({
    invalid_type_error: "Guest count is required",
  }),
  pwd: z.number({
    invalid_type_error: "Guest count is required",
  }),
});

export type GuestDetailsInput = z.infer<typeof guestDetails>;

export const reviewBooking = z.object({});

export type ReviewBookingInput = z.infer<typeof reviewBooking>;

const cardNumberRegex =
  /^4[0-9]{12}(?:[0-9]{3})?$|^5[1-5][0-9]{14}$|^2(2[2-9][0-9]{2}|[3-6][0-9]{3}|7[0-1][0-9]{2}|720)[0-9]{12}$/;

export const paymentDetails = z
  .object({
    paymentOption: z
      .string({
        required_error: "Payment option is required",
        invalid_type_error: "Payment option is required",
      })
      .min(1, { message: "Payment option is required" }),
    paymentMethod: z
      .string({
        required_error: "Payment method is required",
        invalid_type_error: "Payment method is required",
      })
      .min(1, { message: "Payment method is required" }),

    bankCode: z.string().nullable(),
    cardNumber: z
      .number({
        invalid_type_error: "Card number is required",
      })
      .nullable(),
    expMonth: z
      .number({
        invalid_type_error: "Expiration month is required",
      })
      .nullable(),
    expYear: z
      .number({
        invalid_type_error: "Expiration year is required",
      })
      .nullable(),
    cvc: z
      .number({
        invalid_type_error: "CVC is required",
      })
      .nullable(),

    bookingFee: z.number(),
  })
  .superRefine((data, ctx) => {
    const currentYear = dayjs().year();

    if (data.paymentMethod === PaymentMethod.CARD) {
      if (!data.cardNumber) {
        ctx.addIssue({
          path: ["cardNumber"],
          message: "Card number is required",
          code: "custom",
        });
      } else if (!cardNumberRegex.test(data.cardNumber.toString())) {
        ctx.addIssue({
          path: ["cardNumber"],
          message: "Card number must be a valid Visa or MasterCard number",
          code: "custom",
        });
      }

      if (!data.expMonth) {
        ctx.addIssue({
          path: ["expMonth"],
          message: "Expiration month is required",
          code: "custom",
        });
      } else if (data.expMonth < 1 || data.expMonth > 12) {
        ctx.addIssue({
          path: ["expMonth"],
          message: "Invalid expiration month",
          code: "custom",
        });
      }

      if (!data.expYear) {
        ctx.addIssue({
          path: ["expYear"],
          message: "Expiration year is required",
          code: "custom",
        });
      } else if (data.expYear < currentYear || data.expYear > currentYear + 5) {
        ctx.addIssue({
          path: ["expYear"],
          message: "Invalid expiration year",
          code: "custom",
        });
      }

      if (!data.cvc) {
        ctx.addIssue({
          path: ["cvc"],
          message: "CVC is required",
          code: "custom",
        });
      } else if (data.cvc.toString().length !== 3) {
        ctx.addIssue({
          path: ["cvc"],
          message: "CVC must be 3 digits",
          code: "custom",
        });
      }

      return;
    }

    if (data.paymentMethod === PaymentMethod.DOB) {
      if (!data.bankCode) {
        return ctx.addIssue({
          path: ["bankCode"],
          message: "Bank code is required",
          code: "custom",
        });
      }
    }
  });

export type PaymentDetailsInput = z.infer<typeof paymentDetails>;

export const bookingFormSchema = z
  .object({
    startDate: z.date({
      required_error: "Check in date is required",
      invalid_type_error: "Check in date is required",
    }),
    // .refine((date) => dayjs(date).isAfter(today), {
    //   message: "Check-in date must be greater than today",
    // })
    // .refine((date) => dayjs(date).isBefore(endOfYear), {
    //   message: "Check-in date must be less than the end of this year",
    // })
    endDate: z.date({
      required_error: "Check out date is required",
      invalid_type_error: "Check out date is required",
    }),
    // .refine((date) => dayjs(date).isAfter(today), {
    //   message: "Check-out date must be greater than today",
    // })
    // .refine((date) => dayjs(date).isBefore(endOfYear), {
    //   message: "Check-out date must be less than the end of this year",
    // })
    timeSlotId: z
      .string({
        required_error: "Time slot is required",
        invalid_type_error: "Time slot is required",
      })
      .uuid({
        message: "Time slot is required",
      }),
    accommodationId: z
      .string({
        required_error: "Accommodation is required",
        invalid_type_error: "Accommodation is required",
      })
      .uuid({
        message: "Accommodation is required",
      }),

    frontId: z
      .string({
        required_error: "Front ID is required",
        invalid_type_error: "Front ID is required",
      })
      .min(10, {
        message: "Front ID is required",
      }),
    backId: z
      .string({
        required_error: "Back ID is required",
        invalid_type_error: "Back ID is required",
      })
      .min(10, {
        message: "Back ID is required",
      }),
    adults: z
      .number({
        invalid_type_error: "Guest count is required",
      })
      .min(1, {
        message: "At least one adult is required",
      }),
    children: z.number({
      invalid_type_error: "Guest count is required",
    }),
    pwd: z.number({
      invalid_type_error: "Guest count is required",
    }),

    paymentOption: z
      .string({
        required_error: "Payment option is required",
        invalid_type_error: "Payment option is required",
      })
      .min(1, { message: "Payment option is required" }),
    paymentMethod: z
      .string({
        required_error: "Payment method is required",
        invalid_type_error: "Payment method is required",
      })
      .min(1, { message: "Payment method is required" }),

    bankCode: z.string().nullable(),
    cardNumber: z
      .number({
        invalid_type_error: "Card number is required",
      })
      .nullable(),
    expMonth: z
      .number({
        invalid_type_error: "Expiration month is required",
      })
      .nullable(),
    expYear: z
      .number({
        invalid_type_error: "Expiration year is required",
      })
      .nullable(),
    cvc: z
      .number({
        invalid_type_error: "CVC is required",
      })
      .nullable(),

    bookingFee: z.number(),
  })
  .superRefine((data, ctx) => {
    const currentYear = dayjs().year();

    if (data.paymentMethod === PaymentMethod.CARD) {
      if (!data.cardNumber) {
        ctx.addIssue({
          path: ["cardNumber"],
          message: "Card number is required",
          code: "custom",
        });
      } else if (!cardNumberRegex.test(data.cardNumber.toString())) {
        ctx.addIssue({
          path: ["cardNumber"],
          message: "Card number must be a valid Visa or MasterCard number",
          code: "custom",
        });
      }

      if (!data.expMonth) {
        ctx.addIssue({
          path: ["expMonth"],
          message: "Expiration month is required",
          code: "custom",
        });
      } else if (data.expMonth < 1 || data.expMonth > 12) {
        ctx.addIssue({
          path: ["expMonth"],
          message: "Invalid expiration month",
          code: "custom",
        });
      }

      if (!data.expYear) {
        ctx.addIssue({
          path: ["expYear"],
          message: "Expiration year is required",
          code: "custom",
        });
      } else if (data.expYear < currentYear || data.expYear > currentYear + 5) {
        ctx.addIssue({
          path: ["expYear"],
          message: "Invalid expiration year",
          code: "custom",
        });
      }

      if (!data.cvc) {
        ctx.addIssue({
          path: ["cvc"],
          message: "CVC is required",
          code: "custom",
        });
      } else if (data.cvc.toString().length !== 3) {
        ctx.addIssue({
          path: ["cvc"],
          message: "CVC must be 3 digits",
          code: "custom",
        });
      }
      return;
    }

    if (data.paymentMethod === PaymentMethod.DOB) {
      if (!data.bankCode) {
        return ctx.addIssue({
          path: ["bankCode"],
          message: "Bank code is required",
          code: "custom",
        });
      }
    }
  });

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

export const rejectSchema = z.object({
  reasonForRejection: z.string().min(10, "Reason is too short"),
});

export type RejectFormInput = z.infer<typeof rejectSchema>;

export const approveSchema = z.object({
  bookingId: z.string().uuid(),
});

export type ApproveFormInput = z.infer<typeof approveSchema>;
