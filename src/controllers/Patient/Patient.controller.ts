"use server";
import { Prisma } from "@/src/generated/prisma";
import { prisma } from "@/src/lib/prisma"
import bcrypt from "bcryptjs";
import createPatientSession  from "@/src/app/api/Patient/route";


// Function to hash the password
async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// Sign in / Registering a patient
export async function registerPatientInDB(email: string, password: string) {
    try {
        // Check if the patient already exists
        const existingPatient = await prisma.patient.findUnique({
            where: { email },
        });

        if (existingPatient) {
            throw new Error("Patient already exists with this email.Please log in instead.");
        }

        // Create a new patient

        if (!email || !password) {
            throw new Error("All fields are required.");
        }
        const hashedPassword = await hashPassword(password);

        if (!hashedPassword) {
            throw new Error("Password hashing failed.");
        }

        const newPatient = await prisma.patient.create({
            data: {
                email: email,
                password: hashedPassword,
            },
        });

        // Create a session for the new patient
        await createPatientSession(newPatient.id, newPatient.email);

        return newPatient;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle known Prisma errors
            if (error.code === 'P2002') {
                throw new Error("A patient with this email already exists.");
            }
        }
        // Handle other errors
        console.error("Error registering patient:", error);
        throw new Error("An error occurred while registering the patient.");
    }
}

// // Log in a patient
// export async function loginPatientInDB(email: string, password: string) {
//     try {
//         // Find the patient by email
//         const patient = await prisma.patient.findUnique({
//             where: { email },
//         });

//         if (!patient) {
//             throw new Error("Patient not found.");
//         }

//         // Verify the password
//         const isPasswordValid = await bcrypt.compare(password, patient.password);
//         if (!isPasswordValid) {
//             throw new Error("Invalid password.");
//         }

//         // Create a session for the patient
//         await createPatientSession(patient.id, patient.email);

//         return patient;
//     }  catch (error) {
//         if (error instanceof Prisma.PrismaClientKnownRequestError) {
//             // Handle known Prisma errors
//             if (error.code === 'P2002') {
//                 throw new Error("A patient with this email already exists.");
//             }
//         }
//         // Handle other errors
//         console.error("Error logging in patient:", error);
//         throw new Error("An error occurred while logging in the patient.");
        
//     }
// }

// get patient ID from the email
export async function getPatientIdByEmailInDB(email: string) {
    try {
        // Find the patient by email
        const patient = await prisma.patient.findUnique({
            where: { email },
            select: { id: true },
        });

        if (!patient) {
            throw new Error("Patient not found.");
        }

        return patient.id;
    } catch (error) {
        console.error("Error fetching patient ID:", error);
        throw new Error("An error occurred while fetching the patient ID.");
    }
}




