import { NextFunction, Request, Response } from "express"
import { Auth } from "../../Model/Auth.models";
import createError from "../../util/errorHandle";
import bcrypt from "bcryptjs"
import cloudinaryImg from "../../config/cloudinary";
export const updateUserController=async (
    req:Request,
    res:Response,
    next:NextFunction
  ) => {

    try {

        const oldData = await Auth.findById(req.params.id)
   if(!oldData){
      res.status(400).json({
        data: null,
        meta: null,
        error: {
          status: "400",
          title: `User Does not Exist`,
        },
      });
      return;
    }

        let existingImages = {};
        if (Array.isArray(req.files) && req.files.length > 0) {
          const urlPath = req.files[0].path
          const q = urlPath.split(".")[2].split("/")
          const PublicID = q[q.length - 2].concat("/", q[q.length - 1])
    
          existingImages = {
            imageUrl: urlPath,
            imgPublicId: PublicID
          }
          if (oldData && oldData.profileImage?.imgPublicId) {
            await cloudinaryImg.uploader.destroy(oldData.profileImage.imgPublicId, (error, result) => {
              if (error) {
                console.error('Error deleting thumbnail image:', error);
              } else {
                console.log('Deleted thumbnail image:', result);
              }
            });
          }
          req.body.profileImage = existingImages;
    
        }
        if (req.body&&req.body.password) {
    
          const isPassword = oldData&&oldData.password && await bcrypt.compare(req.body.password, oldData.password);
          if (!isPassword) {
            return next(createError(404, 'Your previous Password is incorrect '));
          }
          else {
    
            const saltRounds = 10;
            const password = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = password
    
          }
    
        }
        const userToUpdate = await Auth.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json({
          message: 'User update Successfully.',
          data: userToUpdate,
          statusCode: 200,
        });
    

    } catch (error) {
         console.log("error7",error)

     next(error)   
    }
  }
