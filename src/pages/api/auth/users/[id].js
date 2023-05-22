import connectDB from "@/lib/mongodb";
import { getSingleUser, updateUser } from "../../../../controllers/userController";

/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

const idHandler = async (req, res) => {
    if (req.method === "GET") {
        try {
            await connectDB();

            if (req.query.id) {
                getSingleUser(req, res);
            }
        } catch (error) {
            res.status(401).json({ message: `${error}` });
        }
    } else if (req.method === "DELETE") {
        try {
            await connectDB();

            deleteBlogPost(req, res);
        } catch (error) {
            res.status(401).json({ message: `${error}` });
        }
    } else if (req.method === "PATCH") {
        try {
            await connectDB();

            console.log(req.query.body);
            updateUser(req, res);
        } catch (error) {
            res.status(401).json({ message: `${error}` });
        }
    }
};

export default idHandler;
