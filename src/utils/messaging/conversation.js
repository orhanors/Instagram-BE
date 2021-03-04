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
			return newConversation;
		}
		const foundSender = await ConversationModel.findOne({
			name: roomName,
			"members.id": sender,
		});

		if (!foundSender) {
			// if user is not exist,let's add it to the members
			const updatedConversation = await ConversationModel.findOneAndUpdate(
				{ name: roomName },
				{ $addToSet: { members: { id: sender, socketId } } },
				{ new: true }
			);
			if (!updatedConversation) {
				throw new Error("Sender update failed");
			} else {
				return updatedConversation;
			}
		} else {
			// if user is already in room let's update sockedId
			const updatedSender = await ConversationModel.findOneAndUpdate(
				{ name: roomName, "members.id": sender },
				{ "members.$.socketId": socketId },
				{ new: true }
			);
		}

		return foundConv;
	} catch (error) {
		console.log("handle conversation err: ", error);
	}
};

const updateUserSocketId = async (sender, socketId) => {
	try {
		const foundConversations = await ConversationModel.updateMany(
			{
				"members.id": sender,
			},
			{ "members.$.socketId": socketId }
		);

		if (!foundConversations) {
			throw new Error("User conversation found error");
		}
	} catch (error) {
		console.log("find user conversation err: ", error);
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
		console.log("find user conv err: ", error);
	}
};

const getUserByConversation = async (roomName, socketId) => {
	try {
		const conversation = await ConversationModel.findOne({
			name: roomName,
		});

		if (!conversation) {
			throw new Error("Conversation not found");
		}
		const user = conversation.members.find(
			(member) => member.socketId === socketId
		);
		return user;
	} catch (error) {
		console.log("get users by conversation err: ", error);
	}
};

const addMessage = async (messageContent, roomName) => {
	try {
		const foundConv = await ConversationModel.findOne({ name: roomName });
		if (!foundConv) {
			throw new Error("No conversation found");
		}
		foundConv.messages.push(messageContent);
		await foundConv.save();
	} catch (error) {
		console.log("Add message error: ", error);
	}
};
module.exports = {
	generateUniqueRoomName,
	startConversation,
	updateUserSocketId,
	getUserByConversation,
	addMessage,
	findUserConversations,
};
