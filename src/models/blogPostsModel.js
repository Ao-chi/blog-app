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
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            public_id: {
                type: String,
                // required: false,
            },
            url: {
                type: String,
                // required: false,
            },
        },
    },
    { timestamps: true }
);

const BlogPost = mongoose.models.BlogPost || model("BlogPost", blogPostSchema);
export default BlogPost;
