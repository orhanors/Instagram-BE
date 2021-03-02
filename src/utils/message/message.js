const { MessageModel } = require("../../services/message");

const addMessageToDb = async (data) => {
	try {
		const newMessage = new MessageModel({
			msg: data.msg,
			receiver: data.receiver,
			sender: data.sender,
		});

		await newMessage.save();
	} catch (error) {
		console.log("add message error: ", error);
	}
};

module.exports = { addMessageToDb };
