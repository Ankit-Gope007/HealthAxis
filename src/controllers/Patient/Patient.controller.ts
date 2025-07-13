import { prisma } from "@/src/lib/prisma";
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';


// Function to register a new patient with email and password
export const registerPatientCredential = async (data: { email: string, password: string }) => {
    // take the value and store it in a variable
    const { email, password } = data;


    // Check if the email already exists
    const existingPatient = await prisma.user.findUnique({
        where: { email: email }
    })

    // If user already exists , return an error response
    if (existingPatient) {
        return NextResponse.json({ error: "Patient already exists" }, { status: 400 });
    }

    // hashing the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create a new patient
    const newPatient = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            role: 'PATIENT', // Assuming 'PATIENT' is the role for patients
        }
    })

    // Return the newly created patient
    return NextResponse.json(
        newPatient,
        { status: 201 }
    );

}

// Function to register a new patient only with email (google sign-in)
export const registerPatientGoogle = async (data: { email: string }) => {
    // take the value and store it in a variable
    const { email } = data;

    // Check if the email already exists
    const existingPatient = await prisma.user.findUnique({
        where: { email: email }
    })

    // If user already exists , return an error response
    if (existingPatient) {
        return NextResponse.json({ error: "Patient already exists" }, { status: 400 });
    }

    // Create a new patient
    const newPatient = await prisma.user.create({
        data: {
            email: email,
            role: 'PATIENT', // Assuming 'PATIENT' is the role for patients
        }
    })

    // Return the newly created patient
    return NextResponse.json(
        newPatient,
        { status: 201 }
    );
}

// Function to get Pateint by ID
export const getPatientById = async (id: string) => {


    // Fetch the patient by ID
    const patient = await prisma.user.findUnique({
        where: { id: id },
        select: {
            id: true,
            email: true,
            role: true,
            profileSetup: true,
            patientProfile: {
                select: {
                    id: true,
                }
            }
        }
    });

    // If patient not found, return an error response
    if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Return the patient data
    return NextResponse.json(patient, { status: 200 });
}

// Create or update patient profile
export const upsertPatientProfile = async (data: {
    patientId: string;
    fullName: string;
    gender: string;
    phone: string;
    imageUrl?: string;
    address?: string;
    dob: string;
    bloodGroup?: string;
    emergencyContactNumber?: string;
    medicalHistory?: string;
    currentMedications?: string;
}) => {
    const {
        fullName,
        patientId,
        gender,
        phone,
        imageUrl,
        address,
        dob,
        bloodGroup,
        emergencyContactNumber,
        medicalHistory,
        currentMedications,
    } = data;



    try {
        const profile = await prisma.patientProfile.upsert({
            where: { patientId },
            update: {
                fullName,
                gender,
                phone,
                imageUrl,
                address,
                dob:new Date(dob),
                bloodGroup,
                emergencyContactNumber,
                medicalHistory,
                currentMedications,
            },
            create: {
                patientId,
                fullName,
                gender: gender ?? "Male",
                phone,
                imageUrl,
                address,
                dob:new Date(dob) ,
                bloodGroup,
                emergencyContactNumber,
                medicalHistory,
                currentMedications,
            },
        });

     

        await prisma.user.update({
            where: { id: patientId }, // Assuming patientId is also the User's ID
            data: { profileSetup: true },
        });

        return profile;
    } catch (error: any) {
        throw new Error(`Failed to upsert patient profile: ${error.message}`);
    }
};

// Get patient profile by patientId
export const getPatientProfile = async (patientId: string) => {
    try {
        const profile = await prisma.patientProfile.findUnique({
            where: { patientId: patientId },

        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return profile
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

// Add image to patient profile
export const addImageToPatientProfile = async (patientId: string, imageUrl: string) => {
    try {
        const updatedProfile = await prisma.patientProfile.update({
            where: { patientId },
            data: { imageUrl:imageUrl },
        });

        return updatedProfile;
    } catch (error: any) {
        throw new Error(`Failed to add image to patient profile: ${error.message}`);
    }
};

// get All Patients Of a Doctor controller:
// export const getAllPatientOfDoctor = async (doctorId:string) => {
//     try {
//         // validate doctor
//         const doctor = await prisma.user.findUnique({
//             where: { id: doctorId },
//         });
//         if (!doctor) {
//             return new Error("Doctor not found.");
//         }

//         // Fetch all the appoiments of the doctor

        
//     } catch (error: any) {
//         return new Error(`Failed to get all patients of doctor: ${error.message}`);
        
//     }
// }