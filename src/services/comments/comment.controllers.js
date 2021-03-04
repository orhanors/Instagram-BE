const CommentModel = require("./comment.schema")
const PostModel = require("../post/post.schema")
const ObjectId = require('mongodb').ObjectID;
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

exports.deleteComment = async(req,res,next)=>{
    try {
        const deleteComment = await CommentModel.findByIdAndDelete(req.params.commentId)
        res.status(204).send("Deleted")
    } catch (error) {
        next(error)   
    }
}
exports.editComment = async(req,res,next)=>{
    const editedComment = await CommentModel.findByIdAndUpdate(
        req.params.commentId,
        req.body,
        {
            runValidators:true,
            new:true,
        }
    )
    res.status(200).send(editedComment._id)
}
exports.addComment = async(req,res,next)=>{
    try{
        const newComment = new CommentModel({
            user: req.user._id,
            ...req.body
        })
        const {_id} =await newComment.save()
        console.log(req.params.postId,"here")
        await PostModel.findByIdAndUpdate(req.params.postId,{
            $push:{
                comments:[{
                    _id:ObjectId(_id)
                }]
            }
        })
        console.log(_id,"whyyyy")
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
