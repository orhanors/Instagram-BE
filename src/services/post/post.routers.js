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
// this endpoints will bring back all the posts of the people you follow and yourself
postRoute.get("/all/me/posts", validateToken, getAllPosts);
// you can get just a specific post
postRoute.get("/:postId", getSpecificPost);

// you will get all your posts
postRoute.get("/all/me", validateToken, getAllMyPosts);

// this will be like and unlike route
postRoute.post("/:postId/like", validateToken, handleLike);

// this is to post a description or edit the post
postRoute.put("/:postId", cloudinaryMulter.single("image"), editSinglePost);

// delete the single post
postRoute.delete("/:postId", deletePost);
// this is for adding an image 
postRoute.post("/me", cloudinaryMulter.single("image"), validateToken, newPost);

module.exports = postRoute;
