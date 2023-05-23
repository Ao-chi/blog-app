import mongoose from "mongoose";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";

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

// UPDATE SINGLE USER
export const updateUser = async (req, res) => {
    const { id } = req.query;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid ID" });
        }
        const user = await User.findOneAndUpdate({ _id: id }, { ...req.body });
        res.status(200).json(user);
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

export const userLogin = async (credentials) => {
    // const { username, email, password } = credentials;
    const email = credentials.email;
    const username = credentials.username;
    const password = credentials.password;

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
