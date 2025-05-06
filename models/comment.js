import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    postId: { type: String, required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, 
  });

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);