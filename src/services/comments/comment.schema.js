const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const CommentSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: String
    },
    {
        timestamps: true,
    }
)

CommentModel= mongoose.model("Comments", CommentSchema)

module.exports = (CommentModel) 