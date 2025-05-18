import "dotenv/config"
import { v2 as cloudinaryImg } from "cloudinary"

cloudinaryImg.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Typo fixed here
})

export default cloudinaryImg
