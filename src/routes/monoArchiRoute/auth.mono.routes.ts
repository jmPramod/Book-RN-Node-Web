import express from "express";
import { loginMonoController } from "../../controller/monoController/auth.mono.controller";

export const adminRoutesMono=express.Router()

adminRoutesMono.get("/login",loginMonoController)