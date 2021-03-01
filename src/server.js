const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { PORT, MONGODB_URI } = process.env;
const server = express();
const httpServer = http.createServer(server);
server.use(express.json());
server.use(cors());

mongoose
	.connect(MONGODB_URI, {
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => console.log("✔ Connected to DB..."))
	.catch((e) => console.log("❌ DB connection error: ", e));
httpServer.listen(PORT, () => {
	if (server.get("env") === "production") {
		console.log("🚀 Server is running on CLOUD on PORT: ", PORT);
	} else {
		console.log("🚀 Server is running LOCALLY on PORT: ", PORT);
	}
});
