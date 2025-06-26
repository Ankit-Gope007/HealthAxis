import { NextResponse } from "next/server";
import { registerDoctor } from "@/src/controllers/Doctor/Doctor.controller";
import { uploadToCloudinary } from "@/src/helper/uploadToCloudinary";


export async function POST(request: Request) {

    try {
        // Parse multipart form data (Next.js doesn't do it automatically)
        const formData = await request.formData();

        // Extract the file from the form data
        const licenseDocument = formData.get("licenseDocument") as File;

        // Validate required fields
        if (!formData || !licenseDocument) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upload the license document to Cloudinary
        const licenseUrl = await uploadToCloudinary(licenseDocument);
        // Parse the JSON data
        const body = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            fullName: formData.get("fullName") as string,
            phone: formData.get("phoneNumber") as string,
            specialization: formData.get("specialization") as string,
            experience: parseInt(formData.get("yearsOfExperience") as string, 10),
            licenseNumber: formData.get("licenseNumber") as string,
            address: formData.get("address") as string || undefined, // Optional field
            licenseDocument: licenseUrl // Store the URL of the uploaded document
        }

        
        const result = await registerDoctor(body);
        return NextResponse.json({ message: "Doctor registered successfully", data: result }, { status: 201 });

    } catch (error) {
        console.error("Error in POST /api/doctor/registerDoctor:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}