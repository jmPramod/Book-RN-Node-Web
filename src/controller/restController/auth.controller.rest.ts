import { NextFunction, Request, Response } from "express";
import { Auth, IAuth } from "../../Model/Auth.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { registerSchema } from "../../validators/register.validators";
import createError from "../../util/errorHandle";


 const loginControllerRest = async (
  req:Request,
  res:Response,
  next:NextFunction
) => {
  try {
 const {email}=req.body
    const userEmail = await Auth.findOne({ email });
    if(!userEmail){
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
const passwordMatch= userEmail?.password && await bcrypt.compare( req.body.password,userEmail?.password)
    if(!passwordMatch){
      res.status(404).json({
        data: null,
        meta: null,
        error: {
          status: "400",
          title: `Invalid password`,
        },
      });
      return;
    }

    let {password,...data}=userEmail
    const token = jwt.sign(
      { email: userEmail.email, id: userEmail._id,admin:userEmail.isAdmin },
      process.env.JWT_SECRET as string,{ expiresIn: "90d" }
    );

    res.status(200).json({
      data: userEmail,
      meta: {
        access_token: token,
        token_type: "Bearer",
        expires_in: "90d",
        message: "Logged in successfully",
      },
      error: {
        status: "400",
        title: `User Does not Exist`,
      },
    });
    return;

  } catch (error) {
    next(error);
  }
};

 const registerControllerRest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rePassword,...data } = req.body;
    const {email,phone,password}=data
    const userEmail = await Auth.findOne({ email });
    const userPhone = await Auth.findOne({ phone });
    if(password!=rePassword){
      res.status(400).json({
        data: userEmail,
        meta: null,
        error: {
          status: "400",
          title: `Password do not match`,
        },
      });
      return;
    }
  
    if (userEmail||userPhone) {
      next(createError(400, "User already exists"));
      return;
     }

    const { error, value } = registerSchema.validate(data);
if(error){
     res.status(400).json({
        data: null,
        meta: null,
        error: {
          status: "401",
          title: error.details[0].message,
        },
      });
      return;
}
    const hashPassword=await bcrypt.hash(password,11)
    value.password = hashPassword;

    const newUser=new Auth(value)
    const saveUser=await newUser.save()
    const token = jwt.sign(
      { email: saveUser.email, id: saveUser._id,admin:saveUser.isAdmin },
      process.env.JWT_SECRET as string,{ expiresIn: "90d" }
    );

    res.status(400).json({
      data: saveUser,
      meta: {
        access_token: token,
        token_type: "Bearer",
        expires_in: "90d",
        message: "Logged in successfully",
      },
      error: null,
    });
  } catch (error) {
    console.log("error");
    
    next(error)
  }
};


export{loginControllerRest,registerControllerRest}