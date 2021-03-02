const socketio = require("socket.io");

const { addMessageToDb } = require("../utils/message/message");

const createSocketServer = (server) => {
	const io = socketio(server);
	const users = [];
	io.on("connection", (socket) => {
		console.log("New socket connection: ", socket.id);
		socket.on("user_connected", (username) => {
			console.log("user connected:: ", username);
			users[username] = socket.id;

			socket.emit("user_connected", username);
		});
		socket.on("send_message", async (data) => {
			console.log("data is: ", data);
			const socketId = users[data.receiver];
			console.log("users::::", users);
			socket.broadcast.to(socketId).emit("message_received", data);
			await addMessageToDb(data);
		});
	});
};

module.exports = createSocketServer;
