import { z } from "zod";

export const emailSchema = z.string().email();

export const birthDateSchema = z
  .date({ required_error: "Birthday is required" })
  .refine(
    (val) => {
      const now = new Date();
      const eighteenYearsAgo = new Date(now);
      const eightyYearsAgo = new Date(now);
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      eightyYearsAgo.setFullYear(eightyYearsAgo.getFullYear() - 80);
      return val < eighteenYearsAgo && val > eightyYearsAgo;
    },
    {
      message: "Must be 18 years old and above",
    }
  );

export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(30, { message: "Username must be at most 30 characters long" })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Username can only contain letters, numbers, underscores, and hyphens",
  });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/\d/, { message: "Password must contain at least one digit" })
  .regex(/[@$!%*?&#]/, {
    message: "Password must contain at least one special character",
  });

export const firstNameSchema = z
  .string()
  .min(3, { message: "First name must be at least 3 character long" })
  .max(50, { message: "First name must be at most 50 characters long" })
  .regex(/^[a-zA-Z\s'-]+$/, {
    message:
      "First name can only contain letters, spaces, hyphens, and apostrophes",
  });

export const lastNameSchema = z
  .string()
  .min(2, { message: "Last name must be at least 2 character long" })
  .max(50, { message: "Last name must be at most 50 characters long" })
  .regex(/^[a-zA-Z\s'-]+$/, {
    message:
      "Last name can only contain letters, spaces, hyphens, and apostrophes",
  });

export const fileSchema = z.object({
  originalname: z.string(),
  mimetype: z
    .string()
    .refine((val) => ["image/png", "image/jpeg"].includes(val), {
      message: "Invalid file type. Only PNG and JPEG are allowed.",
    }),
  size: z
    .number()
    .max(5 * 1024 * 1024, { message: "File size should not exceed 5MB." }), // Max 5MB
});

export const avatarSchema = z.object(
  {
    originalname: z.string(),
    mimetype: z
      .string()
      .refine((val) => ["image/png", "image/jpeg"].includes(val), {
        message: "Invalid file type. Only PNG and JPEG are allowed.",
      }),
    size: z
      .number()
      .max(5 * 1024 * 1024, { message: "File size should not exceed 5MB." }), // Max 5MB
  },
  { required_error: "Photo is required" }
);

export const mobileSchema = z.string().regex(/^09\d{9}$/, {
  message: "Invalid mobile number",
});

export const line1Schema = z
  .string({ required_error: "Address line 1 is required" })

  .min(1, "Address line 1 is required");
export const line2Schema = z
  .string({ required_error: "Address line 2 is required" })
  .min(1, "Address line 2 is required");

export const citySchema = z
  .string({ required_error: "City is required" })
  .min(1, "City is required");

export const stateSchema = z
  .string({ required_error: "State is required" })
  .min(1, "State is required");

export const postalCodeSchema = z
  .string({ required_error: "Postal code is required" })
  .min(1, "Postal code is required")
  .min(4, "Postal code must be 4 digits long");

export const countrySchema = z
  .string({ required_error: "Country is required" })
  .min(1, "Country is required");

export const emailVerifiedAtSchema = z.date({
  required_error: "Please verify your email address",
});

export const mobileVerifiedAtSchema = z.date({
  required_error: "Please verify your mobile number",
});

export const emailOtpSchema = z
  .string()
  .min(6, {
    message: "OTP must be 6 characters long",
  })
  .max(6, {
    message: "OTP must be 6 characters long",
  });

export const mobileOtpSchema = z
  .string()
  .min(6, {
    message: "OTP must be 6 characters long",
  })
  .max(6, {
    message: "OTP must be 6 characters long",
  });
