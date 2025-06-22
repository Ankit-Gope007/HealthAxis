import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from "@/src/helper/uploadToCloudinary";



// Doctor Registration controller:
export async function registerDoctor(data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    specialization: string;
    experience: number;
    licenseNumber: string;
    licenseDocument: string;
    address?: string;
}) {
    // Extracting the values from the data object
    const {
        email,
        password,
        fullName,
        phone,
        specialization,
        experience,
        licenseNumber,
        licenseDocument,
        address,
    } = data;
    // Check if the email already exists
    const existingDoctor = await prisma.user.findUnique({
        where: { email: email }
    });

    // If user already exists, return an error response
    if (existingDoctor) {
        throw new Error("Doctor already exists");
    }

    // upload the license document to Cloudinary
    //  const licenseUrl = await uploadToCloudinary(licenseDocument);


    // Hashing the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new doctor
    const newUser = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            role: 'DOCTOR',
            doctorProfile: {
                create: {
                    fullName: fullName,
                    phone: phone,
                    specialization: specialization,
                    experience: experience,
                    licenseNumber: licenseNumber,
                    licenseDocument: licenseDocument, // Store the URL of the uploaded document
                    address: address,
                }
            },
        },
    });
    // Return the newly created doctor
    return {
        success: true,
        message: "Doctor registered successfully",
        userId: newUser.id,
    }
}


// Doctor Login controller: (Doctor is already registered and verified)

export async function loginDoctor(data: {
    email: string;
    password: string,
}) {

    // Extracting the value of email and password from the data object
    const { email, password } = data;

    // Check if the email exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email },
        include: {
            doctorProfile: true, // Include doctor profile details
        }
    })

    // If user does not exist or he is not a doctor , return an error response
    if (!existingUser || existingUser.role !== 'DOCTOR') {
        throw new Error("Doctor does not exist or is not registered");
    }

    // Check if doctor is verified or nor
    if (!existingUser.doctorProfile?.verified) {
        throw new Error("Doctor is not verified yet");
    }

    // Now we will compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, existingUser.password || "");

    // If password is not valid, return an error response
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // If everything is fine, we will generate a JWT token for the doctor
    const token = jwt.sign(
        {
            email: existingUser.email,
            id: existingUser.id,
            role: existingUser.role,
            doctorProfile: existingUser.doctorProfile.id, // Include doctor profile details in the token
        },
        process.env.JWT_SECRET!
    );

    // Set the token in the cookies 
    const cookieStore = await cookies()

    cookieStore.set({
        name: 'doctorToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
    });

    // Return the doctor details and token
    return {
        success: true,
        message: "Doctor logged in successfully",
        userId: existingUser.id,
        doctorProfile: existingUser.doctorProfile,
        token: token,
    };
}