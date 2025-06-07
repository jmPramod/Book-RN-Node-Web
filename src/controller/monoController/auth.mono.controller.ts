import { NextFunction, Request, Response } from "express";

export const loginMonoController=async(req:Request,res:Response,next:NextFunction)=>{

try {
    
return res.render("home")

} catch (error) {
    console.log("error1",error)
    next(error)
}

}



