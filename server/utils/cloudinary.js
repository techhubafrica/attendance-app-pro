// src/utils/cloudinary.js
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'user_profiles', // Optional: Create a folder in Cloudinary
    });
    return result.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    throw new Error('Error uploading image to Cloudinary');
  }
};