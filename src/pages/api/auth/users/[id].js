import connectDB from "@/lib/mongodb";
import { getSingleUser, updateUser, getByUsername, deleteUser } from "../../../../controllers/userController";

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
            // if (req.query.id) {
            //     getByUsername(req, res);
            // }
        } catch (error) {
            res.status(401).json({ message: `${error}` });
        }
    } else if (req.method === "DELETE") {
        try {
            await connectDB();

            deleteUser(req, res);
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

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};
export default idHandler;
