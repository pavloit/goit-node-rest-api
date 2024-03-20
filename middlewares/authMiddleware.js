import jwt from "jsonwebtoken";
import User from "../db/user.js";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader.split(" ", 2);

    if (!authHeader || bearer !== "Bearer" ) {
        return res.status(401).send({message: "Invalid token" })
    }
    console.log({ bearer, token });

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ message: "Invalid token" });
            }
            console.log(decode);
        });
        
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userId);
        console.log(user);

        if (!user || token !== user.token) {
            console.log("TOKEN:", token);
            console.log("user.token", user.token);
            return res.status(401).send({ message: "Not authorized" });
        }
        req.user = user;
        next();
    } catch (error) {
       console.log(error);
        return res.status(401).json({ message: "Not authorized" });
    }
};

export default authMiddleware;