import express from "express";
import userController from "../controller/user-controller.js";
import filmController from "../controller/film-controller.js";
const userRouter = new express.Router();

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// Films API
userRouter.post('/api/films', filmController.create);
userRouter.get('/api/films/:filmId', filmController.get);
userRouter.put('/api/films/:filmId', filmController.update);
userRouter.delete('/api/films/:filmId', filmController.remove);
userRouter.get('/api/films', filmController.search);

export {
    userRouter
}
