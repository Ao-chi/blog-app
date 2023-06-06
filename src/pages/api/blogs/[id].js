import connectDB from "@/lib/mongodb";
import {
    getSingleBlogPost,
    deleteBlogPost,
    updateBlogPost,
} from "../../../controllers/blogPostControllers.js";

/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

const idHandler = async (req, res) => {
    if (req.method === "GET") {
        try {
            await connectDB();
            console.log("Connected to db");

            if (req.query.id) {
                getSingleBlogPost(req, res);
            }
        } catch (error) {
            res.status(400).json({ message: `${error}` });
        }
    } else if (req.method === "DELETE") {
        try {
            await connectDB();

            deleteBlogPost(req, res);
        } catch (error) {
            res.status(400).json({ message: `${error}` });
        }
    } else if (req.method === "PATCH") {
        try {
            await connectDB();
            console.log("Connected to db");

            updateBlogPost(req, res);
        } catch (error) {
            res.status(400).json({ message: `${error}` });
        }
    }
};
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "4mb",
        },
    },
};
export default idHandler;
