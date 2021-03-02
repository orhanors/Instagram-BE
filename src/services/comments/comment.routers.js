const commentsRoute = require("express").Router()

const {validateToken} =  require("../../middlewares/validateToken")
const {
    getComments, addComment
   
}= require("./comment.controllers")

commentsRoute.get("/:postId",validateToken,getComments)

commentsRoute.post("/:postId/add",validateToken,addComment)

commentsRoute.put("/:commentId")

commentsRoute.delete("/:commentId")







module.exports = commentsRoute