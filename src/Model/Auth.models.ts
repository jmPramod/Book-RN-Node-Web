import mongoose, { Document, Schema } from "mongoose";


export interface IAuth extends Document {
  userFirstName?: string;
  userLastName?: string;
  countryCode?: string;
  phone?: number;
  address?: string;
  pinCode?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
  loginHistory?: {
    count?: number;
    current_time?: Date;
  };
  gender?: "Male" | "Female" | "Others";
  profileImage?: {
    imageUrl?: string;
    imgPublicId?: string | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}


const authSchema = new Schema<IAuth>(
  {
    userFirstName: { type: String },
    userLastName: { type: String },
    countryCode: { type: String, default: "+91" },
    phone: { type: Number },
    address: { type: String },
    pinCode: { type: String },
    email: { type: String },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    loginHistory: {
      count: { type: Number },
      current_time: { type: Date, default: Date.now }
    },
    gender: { type: String, enum: ["Male", "Female", "Others"] },
    profileImage: {
      imageUrl: {
        type: String,
        default:
          "https://res.cloudinary.com/dtvq8ysaj/image/upload/v1720770108/Global%20Images/profile_new-removebg-preview_motz7n.png"
      },
      imgPublicId: { type: String, default: null }
    }
  },
  { timestamps: true }
);


export const Auth = mongoose.model<IAuth>("Auth", authSchema);
