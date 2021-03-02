const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userPlaceholderImg =
	"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

const UserSchema = new mongoose.Schema(
	{
		name: { type: String },
		surname: { type: String },
		username: { type: String, unique: true },
		email: { type: String },
		password: { type: String },
		bio: { type: String },
		facebookId: { type: String },
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		isProfileHidden: { type: Boolean, default: false },
		refreshTokens: [{ token: String }],
		image: {
			type: String,
			default: userPlaceholderImg,
		},
	},
	{ timestamp: true }
);

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObj = user.toObject();

	delete userObj.password;
	delete userObj.__v;
	delete userObj.facebookId;
	delete userObj.refreshTokens;

	return userObj;
};

UserSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 10);
	}
	next();
});

UserSchema.statics.findByCredentials = async function (username, password) {
	const user = await this.findOne({ username });

	if (user) {
		const isMatch = await bcrypt.compare(password, user.password);
		if (isMatch) return user;
		else return null;
	} else return null;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
