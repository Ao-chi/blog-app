import connectDB from "@/lib/mongodb";
import { getUserBlog } from "../../../../controllers/blogPostControllers";

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
                getUserBlog(req, res);
            }
        } catch (error) {
            res.status(400).json({ message: `${error}` });
        }
    }
};

export default idHandler;
