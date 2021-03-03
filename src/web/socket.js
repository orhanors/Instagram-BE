const socketio = require("socket.io");
const {
	generateUniqueRoomName,
	startConversation,
	findUserConversations,
} = require("../utils/messaging/conversation");
const createSocketServer = (server) => {
	const io = socketio(server);
	const users = [];
	io.on("connection", (socket) => {
		console.log("New socket connection: ", socket.id);

		socket.on("joinConversation", async (data) => {
			//data:{sender,receiver}
			const roomName = generateUniqueRoomName(data.sender, data.receiver);
			try {
				await startConversation(roomName, data.sender, socket.id);

				const myConversations = await findUserConversations(
					data.sender
				);

				myConversations.map((conversation) =>
					socket.join(conversation.name)
				);

				console.log("New conversation::::", data.sender);
			} catch (error) {
				console.log("join conversation error: ", error);
			}
		});
	});
};

module.exports = createSocketServer;
