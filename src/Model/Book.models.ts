import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the Book document
export interface IBook extends Document {
  title?: string;
  caption?: string;
  image?: {
    imageUrl?: string;
    imgPublicId?: string;
  };
  rating?: number;
  user?: mongoose.Types.ObjectId; // Reference to Auth model
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const bookSchema = new Schema<IBook>(
  {
    title: { type: String },
    caption: { type: String },
    image: {
      imageUrl: { type: String },
      imgPublicId: { type: String }
    },
    rating: { type: Number },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth"
    }
  },
  {
    timestamps: true
  }
);

// Export the model
export const Book = mongoose.model<IBook>("Book", bookSchema);
