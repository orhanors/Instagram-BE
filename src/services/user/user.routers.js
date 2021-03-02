const userRouter = require("express").Router();

const { validateToken } = require("../../middlewares/validateToken");
const { getUserProfile } = require("./user.controllers");

userRouter.get("/me", validateToken, getUserProfile);

module.exports = userRouter;
