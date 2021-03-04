const { validateToken } = require("../../middlewares/validateToken");

const notifyRouter = require("express").Router();

notifyRouter.post("/:notifyId", validateToken, seenNotification);

module.exports = notifyRouter;
