import connectDB from "@/lib/mongodb";
import { getAllUsers } from "../../../../controllers/userController";
import verifyToken from "../../../../middleware/requireAuth";
/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

const userHandler = async (req, res) => {
    if (req.method === "GET") {
        try {
            await connectDB();
            console.log("connected to db");

            // Add verifyToken middleware before the controller function
            // verifyToken(req, res, async () => {
            getAllUsers(req, res);
            // });
        } catch (error) {
            res.status(400).json({ message: `${error}` });
        }
    }
};

export default userHandler;
