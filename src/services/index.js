const services = require("express").Router();
const { authRoute } = require("./auth");
const { postRoute } = require("./post");
services.use("/auth", authRoute);
services.use("/posts", postRoute);

module.exports = services;
