import connectDB from "@/lib/mongodb";
import { loginUser } from "../../../../controllers/userController";
import verifyToken from "../../../../middleware/requireAuth";

/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

const userHandler = async (req, res) => {
    if (req.method === "POST") {
        try {
            await connectDB();
            console.log("connected to db");

            loginUser(req, res);
        } catch (error) {
            res.status(400).json({ message: `${error}` });
        }
    }
};

export default userHandler;
