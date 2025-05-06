import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        postId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;