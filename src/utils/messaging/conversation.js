const { ConversationModel } = require("../../services/conversation");
const Conversation = require("../../services/conversation/conversation.schema");

const generateUniqueRoomName = (user1, user2) => {
	const users = [user1, user2];

	let unique = [...new Set(users)].sort((a, b) => (a < b ? -1 : 1)); // ['username1', 'username2']
	let updatedRoomName = `${unique[0]}@${unique[1]}`;

	return updatedRoomName;
};

const startConversation = async (roomName, sender, socketId) => {
	//roomName: userID1@userID2
	try {
		const foundConv = await ConversationModel.findOne({
			name: roomName,
		});

		if (!foundConv) {
			const newConversation = new ConversationModel({
				name: roomName,
			});
			const senderUser = { id: sender, socketId };
			newConversation.members.push(senderUser);
			await newConversation.save();
			return;
		}
		const foundSender = await ConversationModel.findOne({
			name: roomName,
			"members.id": sender,
		});

		if (!foundSender) {
			const updatedSender = await ConversationModel.findOneAndUpdate(
				{ name: roomName },
				{ $addToSet: { members: { id: sender, socketId } } },
				{ new: true }
			);
			if (!updatedSender) {
				throw new Error("Sender update failed");
			}
		}
	} catch (error) {
		console.log("handle conversation err: ", error);
	}
};

const findUserConversations = async (sender) => {
	try {
		const foundConversations = await ConversationModel.find({
			"members.id": sender,
		});
		if (!foundConversations) {
			throw new Error("User conversation found error");
		}
		return foundConversations;
	} catch (error) {
		console.log("find user conversation err: ", error);
	}
};
module.exports = {
	generateUniqueRoomName,
	startConversation,
	findUserConversations,
};