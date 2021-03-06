const { NotifyModel } = require("../../services/notification");

/**
 * If 'currentUser' follows the 'followedUser', 'followedUser' should be notified
 *
 * @param {*} followedUser User who takes the notification
 */

const addFollowNotification = async (currentUser, followedUser) => {
	const notifyInfo = {
		id: currentUser._id,
		username: currentUser.username,
		image: currentUser.image,
	};

	//Check if the followed user has a notification document
	const oldNotification = await NotifyModel.findOne({
		user: followedUser._id,
	});

	if (!oldNotification) {
		const newNotification = new NotifyModel({ user: followedUser._id });
		//notification.follows keeps the notification info which is currentUser
		//Ex: 👨currentUser started following you ↔ (This notification goes to followed user's notification model)
		newNotification.follows.push(notifyInfo);
		return newNotification;
	}

	oldNotification.follows.push(notifyInfo);
	return oldNotification;
};

const addPostNotification = async (
	currentUser,
	post,
	like = false,
	comment = false
) => {
	const notifyInfo = {
		userId: currentUser._id,
		postId: post._id,
		like,
		comment,
		username: currentUser.username,
	};

	const oldNotification = await NotifyModel.findOne({
		user: post.user,
	});

	if (!oldNotification) {
		const newNotification = new NotifyModel({ user: post.user });
		//notification.follows keeps the notification info which is currentUser
		//Ex: 👨currentUser started following you ↔ (This notification goes to followed user's notification model)
		newNotification.posts.push(notifyInfo);
		return newNotification;
	}

	oldNotification.posts.push(notifyInfo);
	return oldNotification;
};

module.exports = { addFollowNotification, addPostNotification };
