import connectDB from "@/lib/mongodb";
import { registerUser } from "../../../../controllers/userController";

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

            registerUser(req, res);
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
export default userHandler;
