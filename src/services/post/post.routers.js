const postRoute = require("express").Router()
const cloudinaryMulter = require("../../middlewares/cloudinary")
 const {validateToken} =  require("../../middlewares/validateToken")
const {
    newPost,
    getAllMyPosts,
    getAllPosts,
    getSpecificPost,
    deletePost,
    editSinglePost,
    addLike,
    removeLike
}= require("./post.controllers")

postRoute.get("/all/me/posts",validateToken,getAllPosts)
postRoute.get("/:postId",getSpecificPost)

// 603e0edfd647f402e0230afc

postRoute.get("/all/me",validateToken,getAllMyPosts)

postRoute.post("/:postId/like",validateToken,addLike)
postRoute.delete("/:postId/:likeId",validateToken,removeLike)

postRoute.put("/:postId",cloudinaryMulter.single("image"),editSinglePost)

postRoute.delete("/:postId",deletePost)

postRoute.post("/me",cloudinaryMulter.single("image"),validateToken,newPost)



module.exports = postRoute