const services = require("express").Router();
const { authRoute } = require("./auth");
const { postRoute } = require("./post");
const { commentsRoute } = require("./comments");
const userRouter = require("./user/user.routers");
const conversationRouter = require("./conversation/conversation.routers");

services.use("/comments", commentsRoute);
services.use("/auth", authRoute);
services.use("/posts", postRoute);
services.use("/users", userRouter);
services.use("/conversations", conversationRouter);
module.exports = services;
