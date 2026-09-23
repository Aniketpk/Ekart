
import User from "../models/userModels.js";
import jwt from "jsonwebtoken";


export const isAuthenticated = async (req, res, next) => {
    console.log("isAuthenticated secret check:", process.env.SECRET_KEY ? "Defined" : "UNDEFINED");
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("Auth failed: Missing or invalid header:", authHeader);
            return res.status(400).json({
                success: false,
                message: "authorized token is missing or invalid"
            })
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            console.log("Auth failed: Token verification error:", error.name);
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
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        req.id = user._id;
        req.user = user;
        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const isAdmin = (req, res, next) => {
    console.log(`isAdmin check: User ${req.user?._id} has role ${req.user?.role}`);
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        console.log(`isAdmin failed: access denied for role ${req.user?.role}`);
        return res.status(403).json({
            message: "access denied: admin only"
        })
    }
}

