"use client"
import React from 'react'
import { forwardRef } from 'react';
import { useUserStore } from '@/src/store/useUserStore'
import { CldUploadWidget } from "next-cloudinary";
import axios from 'axios';
import toast from 'react-hot-toast';

const ImageUpload = forwardRef<HTMLInputElement>((props, ref) => {
    const { user } = useUserStore();
  
    const handleImageUpload = async (url: string) => {
        try {
            const { user } = useUserStore.getState();
            const patientId = user?.id

            const res = await axios.patch("/api/patient/uploadImage", {
                patientId: patientId,
                imageUrl: url,
            });
            console.log("Image updated in DB:", res.data);
            toast.success("Profile picture updated!");
            // Refresh the patient profile page to reflect the new image
            window.location.reload();



        } catch (err) {
            console.error("Failed to update image in DB", err);
            toast.error("Failed to save image URL.");
        }
    };
    return (
        <CldUploadWidget
            uploadPreset="ml_default"
            signatureEndpoint="/api/patient/sign-cloudinary-params"
            options={{
                cropping: true,
                folder: "patient-profiles",
                sources: ["local", "camera", "url"],
            }}
            onSuccessAction={(result) => {
                const info = result?.info;
                console.log("Upload result:", result);
                if (typeof info === "object" && info !== null && "secure_url" in info) {
                    const secureUrl = (info as { secure_url: string }).secure_url;
                    console.log("Secure URL:", secureUrl);
                    handleImageUpload(secureUrl);
                }
            }}
        >
            {({ open }) => (
                <input
                    ref={ref}
                    type="file"
                    className="hidden"
                    onClick={(e) => {
                        e.preventDefault(); // prevent system picker
                        open(); // open cloudinary widget
                    }}
                />
            )}
        </CldUploadWidget>
    )
})

export default ImageUpload