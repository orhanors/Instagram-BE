const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
	name: { type: String, unique: true },
	members: [{ id: String, socketId: String }],
	messages: [
		{
			sender: { type: String },
			receiver: { type: String },
			msg: { type: String },
		},
	],
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
