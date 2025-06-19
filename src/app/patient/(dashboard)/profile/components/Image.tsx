// import { useRef, useState } from "react";
// import { IoMdAdd } from "react-icons/io";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { Input } from "@/components/ui/input";

// const ProfileImageUploader = () => {
//     const fileInputRef = useRef<HTMLInputElement>(null);


//     return (
//         <>
//             <div
//                 className="w-[100px] h-[100px] rounded-full bg-gray-300 border-4 border-white flex items-center justify-center cursor-pointer"
//             >
//                 <IoMdAdd className="text-4xl text-gray-600" />
//                 <Input
//                     ref={fileInputRef}
//                     type="file"
//                     className="hidden"
//                 />
//             </div>
//         </>
//     );
// };

// export default ProfileImageUploader;

// components/ProfileImageUploader.tsx
// import { useRef, useState } from "react";
// import { IoMdAdd } from "react-icons/io";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { Input } from "@/components/ui/input"; // Assuming you use Shadcn UI Input

// interface ProfileImageUploaderProps {
//     // Initial image URL to display before upload, can be null 
//     initialImageUrl?: string | null;
//     // Callback function to send the uploaded Cloudinary URL to the parent component 
//     onImageUploadSuccess: (imageUrl: string) => void;
// }

// const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ initialImageUrl, onImageUploadSuccess }) => {
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     // State to manage the image URL for preview 
//     const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
//     const [isUploading, setIsUploading] = useState<boolean>(false);

//     // Function to handle file selection and upload
//     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) {
//             return;
//         }

//         // --- Immediate local preview (optional but good UX) ---
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setPreviewUrl(reader.result as string); // Set preview to local file data URL
//         };
//         reader.readAsDataURL(file);
//         // --------------------------------------------------------

//         const formData = new FormData();
//         formData.append("image", file); // 'image' is the key expected by the API route's formidable parser

//         setIsUploading(true);
//         const toastId = toast.loading("Uploading image..."); // Show loading toast

//         try {
//             const response = await axios.post("/api/upload-image", formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data", // Important for FormData
//                 },
//             });

//             const { imageUrl } = response.data;
//             setPreviewUrl(imageUrl); // Update preview to the Cloudinary URL
//             onImageUploadSuccess(imageUrl); // Send the Cloudinary URL back to the parent
//             toast.success("Image uploaded successfully!", { id: toastId }); // Update success toast
//         } catch (error: any) {
//             console.error("Error uploading image:", error);
//             // Revert preview if upload fails (optional)
//             setPreviewUrl(initialImageUrl || null);
//             toast.error(`Image upload failed: ${error.response?.data?.message || error.message}`, { id: toastId });
//         } finally {
//             setIsUploading(false);
//             // Clear the file input value so that selecting the same file again triggers onChange
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = '';
//             }
//         }
//     };

//     // Function to programmatically click the hidden file input
//     const handleDivClick = () => {
//         fileInputRef.current?.click();
//     };

//     return (
//         <div
//             className="w-[100px] h-[100px] rounded-full bg-gray-300 border-4 border-white flex items-center justify-center cursor-pointer overflow-hidden relative group"
//             onClick={handleDivClick}
//             aria-label="Upload profile image"
//         >
//             {previewUrl ? (
//                 <img
//                     src={previewUrl}
//                     alt="Profile Preview"
//                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//             ) : (
//                 <IoMdAdd className="text-4xl text-gray-600 transition-colors duration-300 group-hover:text-gray-700" />
//             )}

//             {isUploading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm animate-pulse">
//                     Uploading...
//                 </div>
//             )}

//             {/* Hidden file input */}
//             <Input
//                 ref={fileInputRef}
//                 type="file"
//                 className="hidden"
//                 onChange={handleFileChange}
//                 accept="image/*" // Restrict file selection to image types
//                 aria-hidden="true" // Hide from accessibility tree as it's controlled by the div
//             />
//         </div>
//     );
// };

// export default ProfileImageUploader;

"use client";

import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/src/store/useUserStore";

export default function UploadImage({ onUpload }: { onUpload: (url: string) => void }) {
    const { user } = useUserStore();
    return (
        <CldUploadWidget
            uploadPreset="ml_default"
            signatureEndpoint="/api/patient/sign-cloudinary-params"
            options={{
                cropping: true,
                folder: "patient-profiles",
                sources: ["local", "camera", "url"],
            }}
            onUpload={ async (result) => {
                const info = result?.info;
                if (typeof info === "object" && info !== null && "secure_url" in info) {
                    const imageUrl = (info as { secure_url: string }).secure_url;

                    // ✅ Save to DB
                    await axios.patch("/api/patient/updateProfile", {
                        patientId: user?.id,      // User/patient ID
                        imageUrl: imageUrl,       // Cloudinary URL
                    });

                    toast.success("Image uploaded & saved!");
                }
            }}
        >
            {({ open }) => (
                <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    onClick={() => open()}
                >
                    Upload Profile Image
                </button>
            )}
        </CldUploadWidget>
    );
}