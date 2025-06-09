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