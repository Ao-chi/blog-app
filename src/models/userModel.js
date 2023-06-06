import mongoose, { Schema, model, models, mongo } from "mongoose";

const userSchema = new mongoose.Schema(
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
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
            // default: "",
        },
        bio: {
            type: String,
        },
        location: {
            type: String,
        },
        blogs: [
            {
                type: Schema.Types.ObjectId,
                ref: "BlogPost",
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.models?.User || model("User", userSchema);

export default User;
