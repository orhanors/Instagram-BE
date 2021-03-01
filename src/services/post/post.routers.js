const postRoute = require("express").Router()
const cloudinaryMulter = require("../../middlewares/cloudinary")

const {
    newPost,
    getAllMyPosts,
    getAllPosts,
    getSpecificPost,
    deletePost,
    editSinglePost
}= require("./post.controllers")

postRoute.get("/:postId",getSpecificPost)

postRoute.get("/all",getAllPosts)

postRoute.get("/all/me",getAllMyPosts)

postRoute.put("/:postId",cloudinaryMulter.single("image"),editSinglePost)

postRoute.delete("/:postId",deletePost)

postRoute.post("/me",cloudinaryMulter.single("image"),newPost)



module.exports = postRoute