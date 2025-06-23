import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin Login controller:
export async function loginAdmin(data: {
    email: string;
    password: string;
}) {
    // Extracting the values from the data object
    const { email, password } = data;

    // Check if the admin exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: email }
    });

    // If admin does not exist, return an error response
    if (!existingAdmin || existingAdmin.role !== 'ADMIN') {
        throw new Error("Admin does not exist");
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, existingAdmin.password!);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign({
        id: existingAdmin.id,
        role: existingAdmin.role,
        email: existingAdmin.email
    },
        process.env.JWT_SECRET!,
        {
            expiresIn: '1h'
        });

    // Set the token in cookies
    const cookieStore = await cookies();
    cookieStore.set('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 Day
    });

    return existingAdmin;
}