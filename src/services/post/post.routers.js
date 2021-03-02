const postRoute = require("express").Router();
const cloudinaryMulter = require("../../middlewares/cloudinary");
const { validateToken } = require("../../middlewares/validateToken");
const {
	newPost,
	getAllMyPosts,
	getAllPosts,
	getSpecificPost,
	deletePost,
	editSinglePost,
	handleLike,
	removeLike,
} = require("./post.controllers");

postRoute.get("/all/me/posts", validateToken, getAllPosts);
postRoute.get("/:postId", getSpecificPost);

postRoute.get("/all/me", validateToken, getAllMyPosts);

postRoute.post("/:postId/like", validateToken, handleLike);

postRoute.put("/:postId", cloudinaryMulter.single("image"), editSinglePost);

postRoute.delete("/:postId", deletePost);

postRoute.post("/me", cloudinaryMulter.single("image"), validateToken, newPost);

module.exports = postRoute;
