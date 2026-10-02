
import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import { session } from "../models/sessionModel.js";


export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "authorized token is missing or invalid"
            })
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "your session has expired, please login again"
                })
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "invalid token, please login again"
                })
            }
            return res.status(401).json({
                success: false,
                message: "token verification failed"
            })
        }
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found"
            })
        }
        if (!decoded.sid || !await session.exists({ _id: decoded.sid, userId: user._id })) {
            return res.status(401).json({ success: false, message: "session is no longer active, please login again" });
        }
        req.id = user._id;
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "The request could not be completed"
        })
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).json({
            message: "access denied: admin only"
        })
    }
}
