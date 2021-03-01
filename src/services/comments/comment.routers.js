const commentsRoute = require("express").Router()

// const {validateToken} =  require("../../middlewares/validateToken")
const {
    getComments
   
}= require("./comment.controllers")

commentsRoute.get("/:postId",getComments)

commentsRoute.post("/:postId/add")

commentsRoute.put("/:commentId")

commentsRoute.delete("/:commentId")







module.exports = commentsRoute