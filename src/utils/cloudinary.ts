import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary
// This function takes the path of the image file and uploads it to Cloudinary
// It returns the secure URL of the uploaded image
export const uploadImageToCloudinary = async (imagePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'patient_profiles', // Optional: Organise your uploads in a specific folder
      resource_type: 'auto',     // Automatically detect file type (image, video, raw)
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' }, // Example: Resize and crop
        { quality: 'auto' } // Optimize quality
      ]
    });
    return result.secure_url; // Return the HTTPS URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};