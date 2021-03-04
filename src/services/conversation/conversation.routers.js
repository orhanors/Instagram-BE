const conversationRouter = require("express").Router();
const { validateToken } = require("../../middlewares/validateToken");
const {
	getUserMessages,
	getUserConversations,
} = require("./conversation.controllers");
conversationRouter.get("/messages/:receiverId", validateToken, getUserMessages);
conversationRouter.get("/", validateToken, getUserConversations);
module.exports = conversationRouter;
