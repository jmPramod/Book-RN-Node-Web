import express from "express";
import { loginControllerRest, registerControllerRest } from "../../controller/restController/auth.controller.rest";
import { updateUserController } from "../../controller/restController/user.controller.rest";
import { uploadProfile } from "../../middlewear/multer";
import { verifyUser } from "../../middlewear/verifyToken";
export const authRoutesRest=express.Router()

authRoutesRest.post("/api/login",loginControllerRest)


authRoutesRest.post("/api/sign-up",registerControllerRest)

authRoutesRest.patch("/api/user/:id", verifyUser, uploadProfile.any(), updateUserController);
