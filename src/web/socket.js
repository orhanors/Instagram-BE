const socketio = require("socket.io");
const {
	generateUniqueRoomName,
	startConversation,
	updateUserSocketId,
	getUserByConversation,
	addMessage,
	findUserConversations,
} = require("../utils/messaging/conversation");
const createSocketServer = (server) => {
	const io = socketio(server);

	io.on("connection", (socket) => {
		console.log("New socket connection: ", socket.id);

		socket.on("startMessaging", async ({ sender }) => {
			try {
				//data:{sender}
				console.log("💆 messagin started....");
				//Update user socket id in DB
				await updateUserSocketId(sender, socket.id);

				//find all conversations that I am in the participants array
				const userConversations = await findUserConversations(sender);

				//we join all the rooms to listen possible message events
				userConversations.map((conversation) => {
					socket.join(conversation.id);
				});
			} catch (error) {
				console.log(error);
			}
		});
		socket.on("joinConversation", async (data) => {
			try {
				console.log(" 🔰 Joined conversation ", data.sender);
				const roomName = generateUniqueRoomName(
					data.sender,
					data.receiver
				);
				const conversation = await startConversation(
					roomName,
					data.sender,
					socket.id
				);

				socket.join(roomName);

				conversation.members.map((member) => {
					io.sockets.connected[member.socketId].join(
						conversation._id
					);
				});
			} catch (error) {
				console.log(error);
			}
		});
		socket.on("privateMessage", async (data) => {
			// data: sender,receiver,msg
			const { sender, receiver, msg } = data;
			const roomName = generateUniqueRoomName(sender, receiver);
			const user = await getUserByConversation(roomName, socket.id);
			const messageContent = {
				msg,
				sender,
				receiver,
			};
			console.log("messge is: ", messageContent);
			await addMessage(messageContent, roomName);
			io.to(roomName).emit("message", messageContent);
		});

		//socket.on("leaveConversation",async())
	});
};

module.exports = createSocketServer;
