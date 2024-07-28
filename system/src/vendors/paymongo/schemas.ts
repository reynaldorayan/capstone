import z from "zod";
import { BankCode, PaymentMethod } from "./types";

export const attachPaymentSchema = z.object({
  payment_intent: z.string().min(1, "Payment intent id is required"),
  payment_method: z.string().min(1, "Payment method id is required"),
  return_url: z.string(),
  metadata: z.object({}).nullable(),
});

export type AttachPaymentSchemaData = z.infer<typeof attachPaymentSchema>;

export const createPaymentMethodSchema = z
  .object({
    type: z.nativeEnum(PaymentMethod),
    billing: z.object(
      {
        address: z.object({
          city: z.string(),
          country: z.string(),
          line1: z.string(),
          line2: z.string(),
          postal_code: z.string(),
          state: z.string(),
        }),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
      },
      {
        required_error: "Billing information is required",
      }
    ),
    details: z.object(
      {
        bank_code: z.nativeEnum(BankCode).optional(),
        card_number: z.string().optional(),
        exp_month: z.number().optional(),
        exp_year: z.number().optional(),
        cvc: z.string().optional(),
      },
      {
        required_error: "Details are required",
      }
    ),
    metadata: z.string().optional(),
  })
  .superRefine((data) => {
    if (data.type === PaymentMethod.CARD) {
      return (
        data.details &&
        data.details.card_number &&
        data.details.exp_month &&
        data.details.exp_year &&
        data.details.cvc
      );
    }

    if (data.type === PaymentMethod.DOB) {
      return data.details && data.details.bank_code;
    }

    return true;
  });

export type CreatePaymentMethodSchemaData = z.infer<
  typeof createPaymentMethodSchema
>;
