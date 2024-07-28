import { z } from "zod";
import { emailOtpSchema, emailSchema, mobileOtpSchema, mobileSchema } from ".";

export const sendMobileOtpSchema = z.object({
  mobile: mobileSchema,
});

export type SendMobileOtpInput = z.infer<typeof sendMobileOtpSchema>;

export const verifyMobileOtpSchema = z.object({
  mobile: mobileSchema,
  otp: mobileOtpSchema,
});

export type VerifyMobileOtpInput = z.infer<typeof verifyMobileOtpSchema>;

export const sendEmailOtpSchema = z.object({
  email: emailSchema,
});

export type SendEmailOtpInput = z.infer<typeof sendEmailOtpSchema>;

export const verifyEmailOtpSchema = z.object({
  email: emailSchema,
  otp: emailOtpSchema,
});

export type VerifyEmailOtpInput = z.infer<typeof verifyEmailOtpSchema>;
