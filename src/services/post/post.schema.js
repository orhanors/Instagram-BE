const {Schema , model} = require("mongoose")

const PostSchema = new Schema({
    image:{type:String},
    description:{type:String},
    user:{type:Schema.Types.ObjectId,ref:"User"},
    comments:[{type:Schema.Types.ObjectId,ref:"Comments"}],
    likes: [
        {
          _id: { type: String, required: true },
          name: { type: String, required: true },
          surname: { type: String, required: true },
        },
      ],
    
}
,{timestamps:true}
)

const PostModel = model("Post",PostSchema)
module.exports = PostModel