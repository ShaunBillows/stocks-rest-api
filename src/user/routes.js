const { Router } = require("express");
const userRouter = Router();
const { createUser, readUser, readAllUsers, deleteUser, updateUser, login, addStock } = require("./controllers");
const { hashPass, comparePass, tokenCheck } = require("../middleware");

// search users routes
userRouter.post("/user/find", readAllUsers);

// user routes
userRouter.get("/user", tokenCheck, readUser)
userRouter.post("/user", hashPass, createUser);
userRouter.delete("/user", tokenCheck, comparePass, deleteUser); 
userRouter.patch("/user", tokenCheck, comparePass, updateUser) 

// login routes
userRouter.get("/login", tokenCheck, login) 
userRouter.post("/login", comparePass, login)

// stock routes
userRouter.post("/user/add", tokenCheck, addStock)

module.exports = userRouter;

