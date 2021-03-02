const { UserModel } = require(".");
const ApiError = require("../../utils/errors/ApiError");

const { NotifyModel } = require("../../services/notification");
const { addFollowNotification } = require("../../utils/user/notify");
exports.getUserProfile = async (req, res, next) => {
	try {
		res.status(200).send(req.user);
	} catch (error) {
		console.log("user get profile error: ", error);
		next(error);
	}
};

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await UserModel.find({});

		res.status(200).send(users);
	} catch (error) {
		console.log("get all users error: ", error);
		next(error);
	}
};

exports.getUserById = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await UserModel.findById(userId);

		if (!user) throw new ApiError(404, "User not found!");
		res.status(200).send(user);
	} catch (error) {
		console.log("get userbyId error: ", error);
		next(error);
	}
};

exports.follow = async (req, res, next) => {
	try {
		const { followedUserId } = req.params;
		const currentUser = req.user;
		const followedUser = await UserModel.findById(followedUserId);

		if (!followedUser)
			throw new ApiError(404, "Followed User user is not found");

		currentUser.following.push(followedUser);
		followedUser.followers.push(currentUser._id);

		if (currentUser._id.toString() === followedUser._id.toString())
			throw new ApiError(400, "Users are same");
		const newNotification = await addFollowNotification(
			currentUser,
			followedUser
		);

		//If one of them fails send error
		Promise.all([
			await currentUser.save(),
			await followedUser.save(),
			await newNotification.save(),
		])
			.then((result) => res.status(200).send("Ok"))
			.catch((e) => next(new ApiError()));
	} catch (error) {
		console.log("follow error: ", error);
		next(error);
	}
};

exports.unfollow = async (req, res, next) => {
	try {
		const { unfollowedUserId } = req.params;

		const currentUser = req.user;
		const unfollowedUser = await UserModel.findById(unfollowedUserId);

		if (!unfollowedUser)
			throw new ApiError(404, "UnFollowed User user is not found");

		currentUser.following = currentUser.following.filter(
			(user) => user.toString() !== unfollowedUser._id.toString()
		);

		unfollowedUser.followers = unfollowedUser.followers.filter(
			(user) => user.toString() !== currentUser._id.toString()
		);

		//If one of them fails send error
		Promise.all([await currentUser.save(), await unfollowedUser.save()])
			.then((result) => res.status(200).send("Ok"))
			.catch((e) => next(new ApiError()));
	} catch (error) {
		console.log("unfollow error: ", error);
		next(error);
	}
};
