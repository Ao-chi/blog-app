import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "../models/userModel";
import BlogPost from "@/models/blogPostsModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

// function to generate jsonwebtoken
const generateToken = ({ _id }) => {
    return jwt.sign({ _id }, process.env.ACCESS_TOKEN, { expiresIn: "1d" });
};

// GET all user
export const getAllUsers = async (req, res) => {
    let users;
    try {
        users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET SINGLE USER
export const getSingleUser = async (req, res) => {
    const { id } = req.query;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid Id" });
        }
        const user = await User.findById(id);

        res.status(201).json(user);
    } catch (error) {
        res.status(401).json({ error: "Trouble finding User" });
    }
};

// GET user by username
export const getByUsername = async (req, res) => {
    const { id } = req.query;

    try {
        const user = await User.where("username").equals(id);
        res.status(201).json(user);
    } catch (error) {
        res.status(401).json({ error: "Trouble finding User" });
    }
};

// delete user
export const deleteUser = async (req, res) => {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Trouble finding User" });
    }
    try {
        // Find the user and populate the 'blogs' field
        const user = await User.findById(id).populate("blogs");

        // Get an array of blog post ObjectIDs associated with the user
        const blogPostIds = user.blogs.map((blog) => blog._id);

        if (blogPostIds.length > 0) {
            console.log(blogPostIds);
            // Delete the associated blog posts
            await BlogPost.deleteMany({ _id: { $in: blogPostIds } });
        }

        // Delete the user
        await User.deleteOne({ _id: id });

        res.status(200).json({
            message: "Successfully deleted user and associated blog posts",
            blogPostIds,
            user,
        });

        // res.status(200).json({ message: "Successfully deleted", user });
    } catch (error) {
        return res.status(400).json({ error: "error", message: "Error While Deleting the User" });
    }
};

// UPDATE SINGLE USER
export const updateUser = async (req, res) => {
    const { id } = req.query;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid ID" });
        }

        const currentUserData = await User.findById(id);

        const data = {
            username: req.body.username,
            bio: req.body.bio,
            location: req.body.location,
        };
        // let image = null;

        // Check if the request body contains an 'image' field
        if (req.body.image.url !== currentUserData?.image?.url) {
            const imgId = currentUserData?.image?.public_id;
            // console.log(ImgId);
            // console.log(currentUserData?.image?.url);
            if (imgId) {
                await cloudinary.uploader.destroy(imgId);
            }

            // Upload the image to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(req.body.image, {
                upload_preset: "user_image",
                crop: "scale",
            });

            // Set the 'image' variable to the uploaded image details
            data.image = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url,
            };
        }

        const user = await User.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });
        res.status(200).json(data);
        // console.log(user);
        // res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ error: "Trouble finding User" });
    }
};

// register user POST
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const saltRounds = 10;
    let existingUser;

    //check for empty fields
    if (!username || !email || !password) {
        return res.status(401).json({ error: "All fields must be filled" });
    }
    await connectDB();
    // check for existing user in the db
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log(error);
    }

    // if user exist throw an error message
    if (existingUser) {
        return res.status(500).json({ error: "Email already used" });
    }

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        //create token
        const token = generateToken(user._id);

        res.status(200).json({ email, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// login user
export const loginUser = async (req, res) => {
    const { username, email, password } = req.body;

    // //check for empty fields
    if ((!username && !email) || !password) {
        return res.status(401).json({ error: "All fields must be filled" });
    }
    try {
        //check username || email
        const user = await User.findOne({ $or: [{ username }, { email }] });
        !user && res.status(401).json({ error: "Username or Email not found" });

        //compare hashed password with entered password
        const validated = await bcrypt.compare(password, user.password);
        !validated && res.status(401).json({ error: "Wrong password" });
        console.log(user.password);
        //create token
        const token = generateToken(user._id);
        const id = user._id;

        res.status(200).json({ email, username, token, id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// using next auth
export const userLogin = async (credentials) => {
    const { username, email, password } = credentials;
    // const email = credentials.email;
    // const username = credentials.username;
    // const password = credentials.password;

    try {
        // Check if the provided email or username exists in the database
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            throw new Error("Username or Email not found");
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Wrong password");
        }
        console.log(user);
        return user;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

// module.exports = {
//     getAllUsers,
//     getSingleUser,
//     updateUser,
//     registerUser,
//     loginUser,
//     userLogin,
// };
