const socketio = require("socket.io");

const { addMessageToDb } = require("../utils/message/message");

const createSocketServer = (server) => {
	const io = socketio(server);

	io.on("connection", (socket) => {
		console.log("New socket connection: ", socket.id);
		socket.on("join", (roomName) => {
			console.log("new room: ", roomName);
			let split = roomName.split("@"); // username1@username2 --> ["username1","username2"]

			let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)); // ['username1', 'username2']

			let updatedRoomName = `${unique[0]}@${unique[1]}`; // 'username1@username2'

			Array.from(socket.rooms)
				.filter((it) => it !== socket.id)
				.forEach((id) => {
					socket.leave(id);
					socket.removeAllListeners(`emitMessage`);
				});

			socket.join(updatedRoomName);

			socket.on("sendMessage", (message) => {
				console.log("updated room: ", updatedRoomName);

				io.to(updatedRoomName).emit("message", message);
			});

			socket.on("disconnect", () => {
				console.log(socket.id + "--> disconnected");
				socket.removeAllListeners();
			});

			socket.on("leaveRoom", (roomName) => {
				console.log("room leaved");
				socket.leave(roomName);
			});
		});
	});
};

module.exports = createSocketServer;
