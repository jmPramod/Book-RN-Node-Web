import express from "express";
import { loginControllerRest, registerControllerRest } from "../../controller/restController/auth.controller.rest";
import { updateUserController } from "../../controller/restController/user.controller.rest";
import { uploadProfile } from "../../middlewear/multer";
import { verifyUser } from "../../middlewear/verifyToken";
export const authRoutesRest=express.Router()

authRoutesRest.post("/login",loginControllerRest)


authRoutesRest.post("/sign-up",registerControllerRest)

authRoutesRest.patch("/user/:id", verifyUser, uploadProfile.any(), updateUserController);
