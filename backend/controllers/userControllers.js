import User from "../models/userModels.js";
import bcrypt from 'bcryptjs';
import jwt, { decode } from 'jsonwebtoken';
import { sendEmail } from '../emailVerify/verifyEmail.js';
import { session } from '../models/sessionModel.js';
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";

import cloudinary from "../utils/cloudinary.js";






export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' });
        await sendEmail(email, token); // If email fails, execution jumps to catch block and user is never saved
        newUser.token = token;
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(400).json({
                success: false,
                message: 'Authorization token is missing or invalid'
            })
        }
        const token = authHeader.split(' ')[1]; //['Bearer', 'token']
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            if (error.name === "tokenExpireError") {
                return res.status(400).json({
                    success: false,
                    message: "the registration token has expired"
                })

            }
            return res.status(400).json({
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
        user.token = null
        user.isVerified = true
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        await sendEmail(email, token)
        user.token = token
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email verification link sent successfully",
            token: user.token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);
        if (!email || !password) {
            console.log("Login failed: Email or password missing");
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            console.log(`Login failed: User with email ${email} not found`);
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            console.log(`Login failed: Invalid password for ${email}`);
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        if (existingUser.isVerified === false) {
            console.log(`Login failed: User ${email} is not verified`);
            return res.status(400).json({
                success: false,
                message: "Verify Your Account than login"
            })
        }
        console.log(`Login success for: ${email}`);
        //genrate token
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '30d' })

        existingUser.isLoggedIn = true;
        await existingUser.save()

        //check for exisiting session and delete it 
        const existingSession = await session.findOne({ userId: existingUser._id })
        if (existingSession) {
            await session.deleteOne({ userId: existingUser._id })
        }

        // create a new session
        await session.create({ userId: existingUser._id })
        return res.status(200).json({
            success: true,
            message: `welcome back ${existingUser.firstName}`,
            user: existingUser,
            accessToken: token,
            refreshToken
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const logout = async (req, res) => {
    try {
        const userId = req.id
        await session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) //10min
        user.otp = otp
        user.otpExpiry = otpExpiry

        await user.save()
        await sendOTPMail(email, otp)
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP is not generated or already verified"
            })
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            })
        }
        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        user.otp = null
        user.otpExpiry = null
        await user.save()
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { email } = req.params
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password do not match"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        return res.status(200).json({
            success: true,
            message: "password change sucessfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}

export const allUser = async (_, res) => {
    try {
        const users = await User.find()
        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).select("-password -otp -otpExpiry")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        let userIdToUpdate = req.params.id
        const loggedInUserId = req.user

        console.log("updateUser Debug:", {
            paramsId: userIdToUpdate,
            reqId: req.id,
            role: req.user?.role,
            hasFile: !!req.file,
            cloudConfig: process.env.CLOUD_NAME ? "OK" : "Missing"
        });

        // Robust Auth: If not admin, force update to be correct authenticated user ID
        // This prevents 403 errors from mismatched URL params
        if (req.user.role !== 'admin') {
            userIdToUpdate = req.id;
        }

        const { firstName, lastName, address, city, zipCode, state, phone, role } = req.body

        // No strict check needed here as we forced ID match above for standard users
        // But we keep admin check implicitly handled by the logic

        // No strict check needed here as we forced ID match above for standard users
        let user = await User.findById(userIdToUpdate)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        let profilePicUrl = user.profilePic
        let profilePicPublicId = user.profilePicPublicId

        // Check for file (debug log)
        if (!req.file) {
            console.log("No file received in request");
        }

        //image upload logic
        if (req.file) {
            console.log("Uploading file to Cloudinary...");
            // Delete old image if exists
            if (profilePicPublicId) {
                try {
                    await cloudinary.uploader.destroy(profilePicPublicId)
                    console.log("Old profile picture deleted");
                } catch (error) {
                    console.log("Error deleting old profile pic (ignoring):", error.message)
                }
            }


            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "profile" },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary Upload Error:", error);
                                reject(error)
                            }
                            else resolve(result)
                        }
                    )
                    stream.end(req.file.buffer)
                })

                console.log("Upload Success:", uploadResult.secure_url);
                profilePicUrl = uploadResult.secure_url;
                profilePicPublicId = uploadResult.public_id
            } catch (error) {
                console.error("Upload Promise Failed:", error);
                throw error; // Re-throw the original error to be caught by main catch block
            }
        }
        //update fields
        user.firstName = firstName || user.firstName
        user.lastName = lastName || user.lastName
        user.address = address || user.address
        user.city = city || user.city
        user.state = state || user.state
        user.zipCode = zipCode || user.zipCode
        user.phone = phone || user.phone
        user.role = role || user.role
        user.profilePic = profilePicUrl
        user.profilePicPublicId = profilePicPublicId
        const updatedUser = await user.save()
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        })

    } catch (error) {
        console.error("Update User Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}
