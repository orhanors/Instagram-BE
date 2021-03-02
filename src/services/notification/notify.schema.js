const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	follows: [{ id: String, username: String, image: String }],
	posts: [{ id: String, like: Boolean, comment: Boolean, username: String }],
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
