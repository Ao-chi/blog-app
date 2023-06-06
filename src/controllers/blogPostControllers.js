import mongoose from "mongoose";
import BlogPost from "../models/blogPostsModel";
import User from "../models/userModel";
import multer from "multer";
import { createRouter, expressWrapper } from "next-connect";
import cloudinary from "@/lib/cloudinary";

const router = createRouter();

// handle file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, "/public/uploads");
//     },
//     filename: (req, file, callback) => {
//         console.log(file);
//         callback(null, Date.now() + "-" + file.originalname);
//     },
// });

// const upload = multer({ storage: storage });

// GET all blog posts
const getBlogPosts = async (req, res) => {
    const blogs = await BlogPost.find({}).sort({ createdAt: -1 }).populate("author");

    res.status(200).json(blogs);
};

// GET a single blog posts
const getSingleBlogPost = async (req, res) => {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Blog Post" });
    }

    const blog = await BlogPost.findById(id).populate("author");

    if (!blog) {
        return res.status(404).json({ error: "No such Blog Post" });
    }

    res.status(200).json(blog);
};

// POST a new blog posts
const createNewBlog = async (req, res) => {
    const { title, content, image, author } = req.body;

    // add blog to db
    let existingUser;
    try {
        existingUser = await User.findById(author);
    } catch (error) {
        return console.log(error);
    }
    if (!existingUser) {
        return res.status(400).json({ error: "Trouble finding User" });
    }

    // Upload image to Cloudinary
    let cloudinaryResult;
    try {
        if (!image) {
            console.log("no image");
        }
        cloudinaryResult = await cloudinary.uploader.upload(image, {
            upload_preset: "post_image",
            crop: "scale",
        });
        // console.log(cloudinaryResult);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Can't upload file" });
    }

    let blog;
    if (cloudinaryResult && cloudinaryResult.public_id) {
        blog = new BlogPost({
            title,
            content,
            image: {
                public_id: cloudinaryResult.public_id,
                url: cloudinaryResult.secure_url,
            },
            author,
        });
    } else {
        blog = new BlogPost({
            title,
            content,
            image,
            author,
        });
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });

        await session.commitTransaction();

        res.status(200).json(blog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE a blog posts
const deleteBlogPost = async (req, res) => {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Blog Post" });
    }
    try {
        const blog = await BlogPost.findById(id);

        const imgId = blog.image.public_id;
        if (imgId) {
            await cloudinary.uploader.destroy(imgId);
        }

        const deleteBlog = await BlogPost.findByIdAndDelete({ _id: id }).populate("author");
        await deleteBlog.author.blogs.pull(deleteBlog);
        await deleteBlog.author.save();
        res.status(200).json({ message: "Successfully deleted", deleteBlog });
    } catch (error) {
        return res.status(400).json({ error: "error", message: "Error While Deleting the Blog" });
    }
};

// GET user Blog by id
const getUserBlog = async (req, res) => {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Blog Post" });
    }

    let userBlogs;
    try {
        userBlogs = await User.findById(id).populate("blogs");

        return res.status(200).json({ message: "Success", author: userBlogs });
    } catch (error) {
        if (!userBlogs) {
            return res.status(404).json({ error: "Trouble Finding Blog" });
        }
    }
};

// GET user Blog by id
const getBlogByUsername = async (req, res) => {
    const { id } = req.query;

    let userBlogs;
    try {
        userBlogs = await User.where("username").equals(id).populate("blogs");

        return res.status(200).json({ message: "Success", author: userBlogs });
    } catch (error) {
        if (!userBlogs) {
            return res.status(404).json({ error: "Trouble Finding Blog" });
        }
    }
};

// UPDATE a blog posts
const updateBlogPost = async (req, res) => {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Blog Post" });
    }

    const blog = await BlogPost.findOneAndUpdate({ _id: id }, { ...req.body });

    if (!blog) {
        return res.status(400).json({ error: "No such Blog Post" });
    }

    res.status(200).json(blog);
};

module.exports = {
    getBlogPosts,
    getSingleBlogPost,
    createNewBlog,
    deleteBlogPost,
    getUserBlog,
    updateBlogPost,
};
