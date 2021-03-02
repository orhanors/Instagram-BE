const userRouter = require("express").Router();

const { validateToken } = require("../../middlewares/validateToken");
const {
	getUserProfile,
	getAllUsers,
	getUserById,
	follow,
	unfollow,
} = require("./user.controllers");

userRouter.get("/me", validateToken, getUserProfile);
userRouter.get("/", validateToken, getAllUsers);
userRouter.get("/:userId", validateToken, getUserById);

//Following

userRouter.post("/follow/:followedUserId", validateToken, follow);

userRouter.delete("/unfollow/:unfollowedUserId", validateToken, unfollow);

module.exports = userRouter;
