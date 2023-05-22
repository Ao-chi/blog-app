import jwt from "jsonwebtoken";
import User from "../models/userModel";

const verifyToken = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers;
    if (!authorization) {
        // return res.writeHead(302, { Location: "/login" });
        return res.status(401).json({ error: "Authorization token Required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN);

        req.user = await User.findOne({ _id }).select("_id");
        next();
    } catch (error) {
        console.log(error);

        res.status(401).json({ error: "Request is not Authorized" });
    }
};

export default verifyToken;
