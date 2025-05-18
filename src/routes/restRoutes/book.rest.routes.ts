import express from "express";
import { createBookRestController } from "../../controller/restController/book.controller.rest";
import { verifyUser } from "../../middlewear/verifyToken";
import { uploadBook } from "../../middlewear/multer";

export const bookRoutesRest=express.Router()
bookRoutesRest.post("/api/book",verifyUser,uploadBook.any(), createBookRestController)

