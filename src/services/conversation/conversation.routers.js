const conversationRouter = require("express").Router();
const { validateToken } = require("../../middlewares/validateToken");
const { getUserMessages } = require("./conversation.controllers");
conversationRouter.get("/messages/:receiverId", validateToken, getUserMessages);

module.exports = conversationRouter;
