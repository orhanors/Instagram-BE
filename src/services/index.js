const services = require("express").Router();
const { authRoute } = require("./auth");
services.use("/auth", authRoute);

module.exports = services;
