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
		const messages = await ConversationModel.find(
			{ name: roomName },
			{ messages: 1, _id: 0 }
		);
		if (!messages) {
			throw new ApiError(404);
		}
		res.status(200).send(messages[0].messages);
	} catch (error) {
		console.log("get messges error: ", error);
		next(error);
	}
};

exports.getUserConversations = async (req, res, next) => {
	try {
		const userId = req.user._id;
		const conversations = await ConversationModel.find({
			name: { $regex: `.*${userId}.*` },
		});

		if (!conversations) {
			throw new ApiError(404);
		}
		res.status(200).send(conversations);
	} catch (error) {
		console.log("get conversation error: ", error);
	}
};
