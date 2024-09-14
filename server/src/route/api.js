import express from "express";
import userController from "../controller/user-controller.js";
import filmController from "../controller/film-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
const userRouter = new express.Router();

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// Films API
userRouter.post('/api/films', authMiddleware, filmController.create);
userRouter.get('/api/films/:filmId', authMiddleware, filmController.get);
userRouter.put('/api/films/:filmId', authMiddleware, filmController.update);
userRouter.delete('/api/films/:filmId', authMiddleware, filmController.remove);
userRouter.get('/api/films', authMiddleware, filmController.search);

export {
    userRouter
}
