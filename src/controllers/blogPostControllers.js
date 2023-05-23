import mongoose from "mongoose";
import User from "../models/userModel";
import BlogPost from "../models/blogPostsModel";
import multer from "multer";
import { createRouter, expressWrapper } from "next-connect";

const router = createRouter();

// handle file uploads
export const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "/public/uploads");
    },
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

// GET all blog posts
export const getBlogPosts = async (req, res) => {
    const blogs = await BlogPost.find({}).sort({ createdAt: -1 }).populate("author");

    res.status(200).json(blogs);
};

// GET a single blog posts
export const getSingleBlogPost = async (req, res) => {
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
export const createNewBlog = async (req, res) => {
    const { title, content, author } = req.body;

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

    const blog = new BlogPost({
        title,
        content,
        author,
    });

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
export const deleteBlogPost = async (req, res) => {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Blog Post" });
    }
    try {
        const blog = await BlogPost.findByIdAndRemove({ _id: id }).populate("author");
        await blog.author.blogs.pull(blog);
        await blog.author.save();
        res.status(200).json({ message: "Successfully deleted", blog });
    } catch (error) {
        return res.status(400).json({ error: "error", message: "Error While Deleting the Blog" });
    }
};

// GET user Blog by id
export const getUserBlog = async (req, res) => {
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

// UPDATE a blog posts
export const updateBlogPost = async (req, res) => {
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

// module.exports = {
//     getBlogPosts,
//     getSingleBlogPost,
//     createNewBlog,
//     deleteBlogPost,
//     getUserBlog,
//     updateBlogPost,
// };
