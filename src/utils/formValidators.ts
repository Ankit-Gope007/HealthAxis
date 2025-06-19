
import { z } from "zod";

export const PatientProfileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Phone number is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date of birth is required and must be valid",
  }),
  bloodGroup: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  patientId: z.string().min(1, "Patient ID is missing"),
});