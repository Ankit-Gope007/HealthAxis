import { NextResponse } from "next/server";
import { updateDoctorProfile } from "@/src/controllers/Doctor/Doctor.controller";
import { uploadToCloudinary } from "@/src/helper/uploadToCloudinary";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const formData = await request.formData();
        const token = cookieStore.get("doctorToken")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
        }
        // Verify the token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        const doctorId = decoded.id;
        if (!doctorId) {
            return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
        }
        // Extract the file from the form data
        const profileImage = formData.get("profileImage") as File;
        // Validate required fields
        if (!formData || !doctorId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // Prepare the data for updating the profile
        const updateData: any = {
            address: formData.get("address") as string || undefined, // Optional field
            clinicAddress: formData.get("clinicAddress") as string || undefined, // Optional field
            experience: parseInt(formData.get("yearsOfExperience") as string, 10) || undefined, // Optional field
            consultationFee: parseFloat(formData.get("consultationFee") as string) || undefined ,// Optional field
            education: formData.get("education") as string || undefined, // Optional field
            certifications: formData.get("certifications") as string || undefined, // Optional field
            bio: formData.get("bio") as string || undefined // Optional field
        };
        // If a profile image is provided, upload it to Cloudinary
        if (profileImage) {
            const imageUrl = await uploadToCloudinary(profileImage);
            updateData.imageUrl = imageUrl; // Store the URL of the uploaded image
        }   
        // Call the controller to update the doctor's profile
        const result = await updateDoctorProfile(doctorId, updateData);
        return NextResponse.json({ message: "Doctor profile updated successfully", data: result }, {
            status: 200
        });
        
    } catch (error) {
        console.error("Error in POST /api/doctor/updateProfile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}