import z from "zod";
import {
  avatarSchema,
  birthDateSchema,
  citySchema,
  countrySchema,
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  line1Schema,
  line2Schema,
  mobileSchema,
  passwordSchema,
  postalCodeSchema,
  stateSchema,
  usernameSchema,
} from ".";

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    photo: avatarSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    birthDate: birthDateSchema,
    email: emailSchema,
    mobile: mobileSchema,
    line1: line1Schema,
    line2: line2Schema,
    city: citySchema,
    state: stateSchema,
    postalCode: postalCodeSchema,
    country: countrySchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    termsAndConditions: z.boolean().refine((val) => val, {
      message: "Please accept the terms and conditions",
    }),
    dataPrivacyPolicy: z.boolean().refine((val) => val, {
      message: "Please accept the data privacy policy",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type SignupSchema = z.infer<typeof signupSchema>;
