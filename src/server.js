const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const services = require("./services");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const corsOptions = require("./utils/server/corsOptions");
//👌 Initial Setup
require("./middlewares/passport");
const { PORT, MONGODB_URI } = process.env;
const server = express();
const httpServer = http.createServer(server);

//👌 Middlewares
server.use(express.json());
server.use(cors(corsOptions));
server.use(cookieParser());
server.use(passport.initialize());

//👌 Services
server.use("/api", services);
//👌 Error handling
require("./middlewares/errorHandling")(server);

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
