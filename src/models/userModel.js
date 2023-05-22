import mongoose, { Schema, model, models, mongo } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
        },
        location: {
            type: String,
        },
        blogs: [
            {
                type: mongoose.Types.ObjectId,
                ref: "BlogPost",
            },
        ],
    },
    { timestamps: true }
);

export default models.User || model("User", userSchema);
