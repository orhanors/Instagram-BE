const commentsRoute = require("express").Router()

const {validateToken} =  require("../../middlewares/validateToken")
const {
    getComments, addComment, editComment, deleteComment
   
}= require("./comment.controllers")

commentsRoute.get("/:postId",validateToken,getComments)

commentsRoute.post("/:postId/add",validateToken,addComment)

commentsRoute.put("/:commentId",validateToken,editComment)

commentsRoute.delete("/:commentId",validateToken,deleteComment)







module.exports = commentsRoute