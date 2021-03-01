const {Schema , model} = require("mongoose")

const PostSchema = new Schema({
    image:{type:String},
    description:{type:String},
    user:{type:Schema.Types.ObjectId,ref:"User"},
    comments:[{type:Schema.Types.ObjectId,ref:"Comments"}],
    
}
,{timestamps:true}
)

const PostModel = model("Post",PostSchema)
module.exports = PostModel