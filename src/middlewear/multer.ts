import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinaryImage } from "cloudinary";

const ProductStorage = new CloudinaryStorage({
  cloudinary: cloudinaryImage,
  params: async (req, file) => ({
    folder: "BooksImage",
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
      { progressive: true },
      { strip: true },
    ],
  }),
});

const ProfileStorage = new CloudinaryStorage({
  cloudinary: cloudinaryImage,
  params: async (req, file) => ({
    folder: "ProfileRNImage",
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
      { progressive: true },
      { strip: true },
    ],
  }),
});

const uploadProfile = multer({ storage: ProfileStorage });
const uploadBook = multer({ storage: ProductStorage });

export { uploadBook, uploadProfile };
