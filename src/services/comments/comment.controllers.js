const CommentModel = require("./comment.schema")
const PostModel = require("../post/post.schema")

exports.getComments = async(req,res,next)=>{
    try {
        const comments = await CommentModel.find().populate("User")

        if(comments.length > 0){
            res.status(200).send(comments)
        }else{
            res.status(404).send("404 not found or you dont have any comments")
        }

    } catch (error) {
        next(error)
    }
}


exports.addComment = async(req,res,next)=>{
    try{
        const newComment = new CommentModel({
            user: req.user._id,
            ...req.body
        })
        const {_id} = newComment.save()
        await PostModel.findByIdAndUpdate(req.params.postId,{
            $push:{
                comments:[{
                    _id:_id
                }]
            }
        })
        if(_id){
            res.status(200).send("Created the id is :",_id)
        }else{
            res.send("Something bad happend unknown error")
            next(error)
        }
    }catch(error){
        next(error)
    }
}