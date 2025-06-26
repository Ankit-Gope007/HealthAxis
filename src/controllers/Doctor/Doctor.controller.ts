import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from "@/src/helper/uploadToCloudinary";
import { transporter } from "@/src/lib/mail";


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
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

  

    // Return the doctor details and token
    return {
        success: true,
        message: "Doctor logged in successfully",
        doctorProfile: existingUser,
        token: token,
    };
}

// Doctor Logout controller:
export async function logoutDoctor() {
    // Clear the doctor token from cookies
    const cookieStore = await cookies();
    
    cookieStore.set('doctorToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1, // Set maxAge to -1 to delete the cookie
    });

    return {
        success: true,
        message: "Doctor logged out successfully",
    };
}



// Get All Doctors controller:
export async function getAllDoctors() {
    // Fetch all doctors from the database
    const doctors = await prisma.user.findMany({
        where: { role: 'DOCTOR' },
        include: {
            doctorProfile: true, // Include doctor profile details
        }
    });

    // Return the list of doctors
    return {
        success: true,
        message: "Doctors fetched successfully",
        data: doctors,
    };
}


// Get Doctor by ID controller:
export async function getDoctorById(doctorId: string) {
    // Fetch the doctor by ID from the database
    const doctor = await prisma.user.findUnique({
        where: { id: doctorId },
        include: {
            doctorProfile: true, // Include doctor profile details
        }
    });

    // If doctor is not found, return an error response
    if (!doctor || doctor.role !== 'DOCTOR') {
        console.error("Doctor not found with ID:", doctorId);
        console.error("Doctor data:", doctor);
        throw new Error("Doctor not found");
        
    }

    // Return the doctor details
    return {
        success: true,
        message: "Doctor fetched successfully",
        data: doctor,
    };
}


/// Delete Doctor Controller
export const deleteDoctor = async (id: string) => {
    try {
        // First, delete the doctorProfile associated with the user
        await prisma.doctorProfile.delete({
            where: {
                doctorId: id,
            },
        });

        // Then, delete the user
        await prisma.user.delete({
            where: {
                id,
            },
        });

        return {
            success: true,
            message: "Doctor deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting doctor:", error);
        throw new Error("Failed to delete doctor");
    }
};



// Verify Doctor controller:
export async function verifyDoctor(id: string) {
    const doctor = await prisma.user.update({
        where: { id },
        data: {
            doctorProfile: {
                update: {
                    verified: true,
                },
            },
        },
        include: { doctorProfile: true },
    });

    await transporter.sendMail({
        from: '"Health Axis Admin" <no-reply@healthaxis.com>',
        to: doctor.email,
        subject: "Doctor Verification Success",
        html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f9fc; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #28A745;">Health Axis</h2>
  </div>
  <h3 style="color: #333;">Hello Dr. ${doctor.doctorProfile?.fullName},</h3>
  <p style="font-size: 15px; color: #444; line-height: 1.6;">
    We’re pleased to inform you that your profile has been successfully <strong style="color: #28A745;">verified</strong> by our team.
    You now have full access to your doctor dashboard, where you can manage appointments, update your profile, and connect with patients.
  </p>
  <p style="font-size: 15px; color: #444; line-height: 1.6;">
    Thank you for choosing <strong>Health Axis</strong>. We're excited to have you on board!
  </p>
  <div style="margin-top: 30px; text-align: center;">
    <a href="http://localhost:3000/doctor/login" target="_blank" style="background-color: #28A745; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
  </div>
  <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
    If you have any questions or issues, feel free to reply to this email or contact our support team.
  </p>
</div>
    `,
    });

    return doctor;
}

// Update Doctor Profile controller:
export async function updateDoctorProfile(doctorId: string, data: {
    fullName?: string;
    phone?: string;
    specialization?: string;
    experience?: number;
    licenseNumber?: string;
    address?: string;
    dob?: Date;
    consultationFee?: number;
    imageUrl?: string; // Optional field for profile picture
}) {
    // Update the doctor profile in the database
    const updatedDoctor = await prisma.doctorProfile.update({
        where: { doctorId: doctorId },
        data: {
            ...data,
            // If imageUrl is provided, update it
            ...(data.imageUrl && { imageUrl: data.imageUrl }),
        },
        include: {
            doctor: true, // Include user details
        }
    });

    const user = await prisma.user.findUnique({
        where: { id: doctorId },
    });
    // set ProfileSetup to true if not already set
    if (!user?.profileSetup) {
        await prisma.user.update({
            where: { id: doctorId },
            data: { profileSetup: true },
        });
    }

    // Return the updated doctor profile
    return {
        success: true,
        message: "Doctor profile updated successfully",
        data: updatedDoctor,
    };
}