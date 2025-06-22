import { z } from "zod";

export const doctorRegisterSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Please confirm your password."),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number is too long."),
  specialization: z.string().min(2, "Specialization is required."),
  yearsOfExperience: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number." })
    .refine((val) => Number(val) >= 0, { message: "Cannot be negative." }),
  licenseNumber: z.string().min(5, "License number is required."),
  licenseDocument: z
    .any()
    .refine((file) => file instanceof File, "License document must be uploaded."),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
});

export const doctorRegisterSchemaWithPasswordMatch = doctorRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  }
);