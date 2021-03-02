const userRouter = require("express").Router();

const { validateToken } = require("../../middlewares/validateToken");
const {
	getUserProfile,
	getAllUsers,
	getUserById,
	follow,
	unfollow,
	getNotifications,
	changeNotificationSeen,
	editUserProfile,
} = require("./user.controllers");

userRouter.get("/me", validateToken, getUserProfile);
userRouter.get("/", validateToken, getAllUsers);
userRouter.get("/:userId", validateToken, getUserById);
userRouter.put("/me/edit", validateToken, editUserProfile);
userRouter.delete("/me/delete", validateToken);

//Following

userRouter.post("/follow/:followedUserId", validateToken, follow);

userRouter.delete("/unfollow/:unfollowedUserId", validateToken, unfollow);

//Notification
userRouter.get("/notifications/show", validateToken, getNotifications);
userRouter.put(
	"/notification/change/seen",
	validateToken,
	changeNotificationSeen
);

module.exports = userRouter;
