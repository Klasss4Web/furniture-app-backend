const express = require("express");
const userController = require("../controllers/userControllers");
const auth = require("../middleware/authMidedleware")

const userRouter = express.Router();

userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);
userRouter.put("/", auth.verify, userController.updateUser);
userRouter.get("/", auth.verify, userController.getUserProfile);


module.exports = userRouter;
