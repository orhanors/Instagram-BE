const { ConversationModel } = require(".");
const ApiError = require("../../utils/errors/ApiError");
const {
	generateUniqueRoomName,
} = require("../../utils/messaging/conversation");

exports.getUserMessages = async (req, res, next) => {
	try {
		const { receiverId } = req.params;
		const userId = req.user._id;
		const roomName = generateUniqueRoomName(receiverId, userId);
		const messages = await ConversationModel.find({ name: roomName });
		if (!messages) {
			throw new ApiError(404);
		}
		res.status(200).send(messages);
	} catch (error) {
		console.log("get messges error: ", error);
		next(error);
	}
};
