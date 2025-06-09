import { prisma } from "@/src/lib/prisma";
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyJwt } from "@/src/helper/verifyJwt";

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
export const getPatientById = async(id: string) => {
   

    // Fetch the patient by ID
    const patient = await prisma.user.findUnique({
        where: { id : id },
        select: {
            id: true,
            email: true,
            role: true,
            profileSetup: true,
        }
    });

    // If patient not found, return an error response
    if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Return the patient data
    return NextResponse.json(patient, { status: 200 });
}