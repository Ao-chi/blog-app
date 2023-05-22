import connectDB from "@/lib/mongodb";
import { getBlogPosts, createNewBlog } from "../../../controllers/blogPostControllers.js";
import verifyToken from "../../../middleware/requireAuth";

import { getSession } from "next-auth/react";
/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

// const blogHandler = async (req, res) => {
//     if (req.method === "GET") {
//         try {
//             await connectDB();

//             // Add verifyToken middleware before the controller function
//             // verifyToken(req, res, async () => {
//             getBlogPosts(req, res);
//             // });
//         } catch (error) {
//             res.status(400).json({ message: `${error}` });
//         }
//     } else if (req.method === "POST") {
//         try {
//             await connectDB();

//             const session = await getSession({ req });
//             const author = session.user.id;
//             console.log(session);
//             // verifyToken(req, res, async () => {
//             createNewBlog({ ...req, author }, res);
//             // });
//         } catch (error) {
//             res.status(400).json({ message: `${error}` });
//         }
//     }
// };

const blogHandler = async (req, res) => {
    if (req.method === "GET") {
        try {
            await connectDB();
            console.log("Connected to db");

            getBlogPosts(req, res);
        } catch (error) {
            res.status(400).json({ message: `${error}` });
        }
    } else if (req.method === "POST") {
        try {
            await connectDB();
            await createNewBlog(req, res);
        } catch (error) {
            res.status(400).json({ message: `${error}` });
        }
    }
};

export default blogHandler;
