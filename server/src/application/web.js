import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
import fileUpload from "express-fileupload"

export const web = express();
web.use(express.urlencoded({ extended: true }));
web.use(express.json());
web.use(fileUpload())

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
