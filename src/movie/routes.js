const { Router } = require("express");
const userRouter = Router();
const { createUser, readUser, readAllUsers, deleteUser, updateUser, login } = require("./controllers");
const { hashPass, comparePass, tokenCheck } = require("../middleware");

userRouter.get("/movie", createMovie)

module.exports = userRouter;