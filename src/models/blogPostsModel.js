import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

const blogPostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const BlogPost = mongoose.models.BlogPost || model("BlogPost", blogPostSchema);
export default BlogPost;
