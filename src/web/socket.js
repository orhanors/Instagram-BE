const socketio = require("socket.io");
const {
	generateUniqueRoomName,
	startConversation,
	findUserConversations,
	getUserByConversation,
	addMessage,
} = require("../utils/messaging/conversation");
const createSocketServer = (server) => {
	const io = socketio(server);
	const users = [];
	io.on("connection", (socket) => {
		console.log("New socket connection: ", socket.id);

		socket.on("startMessaging", async ({ userId }) => {
			//data:{sender,receiver}

			try {
				//

				const myConversations = await findUserConversations(userId);
				if (myConversations) {
					myConversations.map((conversation) =>
						socket.join(conversation.name)
					);
				}

				console.log("New conversation::::", userId);
			} catch (error) {
				console.log("join conversation error: ", error);
			}
		});
		socket.on("joinConversation", async (data) => {
			const roomName = generateUniqueRoomName(data.sender, data.receiver);
			console.log("roomName: ", roomName);
			try {
				const conversation = await startConversation(
					roomName,
					data.sender,
					socket.id
				);
				console.log("conversation is: ", conversation);
				socket.join(conversation.name);
				conversation.members.map((member) =>
					io.sockets.connected[member.socketId].join(
						conversation.name
					)
				);
				console.log("New conversation::::", data.sender);
			} catch (error) {
				console.log("join conversation error: ", error);
			}
		});
		socket.on("privateMessage", async (data) => {
			//data: sender,receiver,msg
			const { sender, receiver, msg } = data;
			const roomName = generateUniqueRoomName(sender, receiver);
			const user = await getUserByConversation(roomName, socket.id);

			const messageContent = {
				msg,
				sender,
				receiver,
			};

			await addMessage(messageContent, roomName);
			io.to(roomName).emit("message", messageContent);
		});

		//socket.on("leaveConversation",async())
	});
};

module.exports = createSocketServer;
