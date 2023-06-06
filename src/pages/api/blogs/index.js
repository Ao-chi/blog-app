import connectDB from "@/lib/mongodb";
import { getBlogPosts, createNewBlog } from "../../../controllers/blogPostControllers.js";
// import verifyToken from "../../../middleware/requireAuth";

/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

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

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};

export default blogHandler;
