const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	follows: [
		{
			id: String,
			username: String,
			image: String,
			seen: { type: Boolean, default: false },
			time: { type: Date, default: Date.now() },
		},
	],
	posts: [
		{
			id: String,
			like: Boolean,
			comment: Boolean,
			username: String,
			seen: { type: Boolean, default: false },
			time: { type: Date, default: Date.now() },
		},
	],
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
