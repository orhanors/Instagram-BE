const services = require("express").Router();
const { authRoute } = require("./auth");
const { postRoute } = require("./post");
const {commentsRoute} = require("./comments")
services.use("/auth", authRoute);
services.use("/posts", postRoute);
services.use("/comments",commentsRoute)

module.exports = services;
