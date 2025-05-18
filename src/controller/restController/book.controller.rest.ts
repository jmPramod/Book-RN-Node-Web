import { NextFunction, Request, Response } from "express";
import cloudinaryImg from "../../config/cloudinary";
import { Book } from "../../Model/Book.models";

const createBookRestController=async (
    req:Request,
    res:Response,
    next:NextFunction
  ) => {

    try {
       let existingImages = {};
        if (Array.isArray(req.files) && req.files.length > 0) {
          const urlPath = req.files[0].path
          const q = urlPath.split(".")[2].split("/")
          const PublicID = q[q.length - 2].concat("/", q[q.length - 1])
    
          existingImages = {
            imageUrl: urlPath,
            imgPublicId: PublicID
          }
          req.body.image = existingImages;

          
        }
const newBook=new  Book(req.body)
const data =await newBook.save()
res.status(404).json({
  data: data,
  meta: {message:"Book created Successfully"},
  error: null,
});
    } catch (error) {
      console.log("error",error);
      
        next(error)
    }
  }


  export{createBookRestController}