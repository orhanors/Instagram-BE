const services = require("express").Router();
const { authRoute } = require("./auth");
const { postRoute } = require("./post");
const userRouter = require("./user/user.routers");

services.use("/auth", authRoute);
services.use("/posts", postRoute);
services.use("/users", userRouter);

module.exports = services;
