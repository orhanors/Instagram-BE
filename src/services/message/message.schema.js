const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
	{
		msg: { type: String },
		receiver: { type: String }, //username
		sender: { type: String }, //username
	},
	{ timestamp: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
