import User from "../models/userModels.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { sendEmail } from '../emailVerify/verifyEmail.js';
import { session } from '../models/sessionModel.js';
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";

import cloudinary from "../utils/cloudinary.js";






export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        if (!firstName || !lastName || !normalizedEmail || typeof password !== 'string' || password.length < 10 || password.length > 128) {
            return res.status(400).json({
                success: false,
                message: 'Names, a valid email, and a password between 10 and 128 characters are required'
            })
        }
        const existingUser = await User.findOne({ email: normalizedEmail })
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
            email: normalizedEmail,
            password: hashedPassword
        });
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' });
        await sendEmail(normalizedEmail, token); // If email fails, execution jumps to catch block and user is never saved
        newUser.token = crypto.createHash('sha256').update(token).digest('hex');
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { _id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, role: newUser.role, isVerified: newUser.isVerified }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "The request could not be completed"
        })
    }
}

export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: 'Authorization token is missing or invalid'
            })
        }
        const token = authHeader.split(' ')[1]; //['Bearer', 'token']
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
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
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
        const user = await User.findOne({ _id: decoded.id, token: tokenHash })
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
            message: "The request could not be completed"
        })

    }
}

export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
        const user = await User.findOne({ email: normalizedEmail })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        await sendEmail(normalizedEmail, token)
        user.token = crypto.createHash('sha256').update(token).digest('hex')
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email verification link sent successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "The request could not be completed"
        })
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }
        const existingUser = await User.findOne({ email: normalizedEmail })
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        if (existingUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "Verify Your Account than login"
            })
        }
        existingUser.isLoggedIn = true;
        await existingUser.save()

        //check for exisiting session and delete it 
        await session.deleteMany({ userId: existingUser._id })
        const activeSession = await session.create({ userId: existingUser._id })
        // Bind both tokens to the active server-side session so logout/relogin revokes old tokens.
        const tokenClaims = { id: existingUser._id, sid: activeSession._id.toString() }
        const token = jwt.sign(tokenClaims, process.env.SECRET_KEY, { expiresIn: '1d' })
        const refreshToken = jwt.sign(tokenClaims, process.env.SECRET_KEY, { expiresIn: '30d' })
        return res.status(200).json({
            success: true,
            message: `welcome back ${existingUser.firstName}`,
            user: { _id: existingUser._id, firstName: existingUser.firstName, lastName: existingUser.lastName, email: existingUser.email, role: existingUser.role, profilePic: existingUser.profilePic },
            accessToken: token,
            refreshToken
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "The request could not be completed"
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
            message: "The request could not be completed"
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: String(email || '').trim().toLowerCase() })
        if (!user) {
            return res.status(200).json({ success: true, message: "If that account exists, a reset code has been sent" })
        }
        const otp = crypto.randomInt(100000, 1000000).toString()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) //10min
        user.otp = crypto.createHash('sha256').update(otp).digest('hex')
        user.otpExpiry = otpExpiry
        user.otpVerified = false
        user.otpVerifiedAt = null
        user.otpAttempts = 0

        await user.save()
        await sendOTPMail(email, otp)
        return res.status(200).json({
            success: true,
            message: "If that account exists, a reset code has been sent"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "The request could not be completed"
        })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = String(req.params.email || '').trim().toLowerCase()

        if (typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            })
        }
        const user = await User.findOne({ email }).select('+otpVerified +otpVerifiedAt +otpAttempts')
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
        if (user.otpAttempts >= 5) {
            return res.status(429).json({ success: false, message: 'Too many incorrect codes. Request a new reset code.' })
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            })
        }
        const expectedOtp = Buffer.from(user.otp, 'hex')
        const suppliedOtp = crypto.createHash('sha256').update(otp).digest()
        if (expectedOtp.length !== suppliedOtp.length || !crypto.timingSafeEqual(expectedOtp, suppliedOtp)) {
            user.otpAttempts += 1
            await user.save()
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        user.otp = null
        user.otpExpiry = null
        user.otpVerified = true
        user.otpVerifiedAt = new Date()
        user.otpAttempts = 0
        await user.save()
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "The request could not be completed"
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const email = String(req.params.email || '').trim().toLowerCase()
        const user = await User.findOne({ email }).select('+otpVerified +otpVerifiedAt')
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        if (typeof newPassword !== 'string' || !confirmPassword) {
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
        if (newPassword.length < 10 || newPassword.length > 128) {
            return res.status(422).json({ success: false, message: 'Password must be between 10 and 128 characters' })
        }
        if (!user.otpVerified || !user.otpVerifiedAt || Date.now() - user.otpVerifiedAt.getTime() > 10 * 60 * 1000) {
            return res.status(403).json({ success: false, message: 'Verify the password reset code first' })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.otpVerified = false
        user.otpVerifiedAt = null
        user.isLoggedIn = false
        await user.save()
        await session.deleteMany({ userId: user._id })
        return res.status(200).json({
            success: true,
            message: "password change sucessfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "The request could not be completed"
        })

    }

}

export const allUser = async (_, res) => {
    try {
        const users = await User.find().select('-password -otp -otpExpiry -token -otpVerified')
        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "The request could not be completed"
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).select("-password -otp -otpExpiry -otpVerified -token")
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
            message: "The request could not be completed"
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        let userIdToUpdate = req.params.id
        // Robust Auth: If not admin, force update to be correct authenticated user ID
        // This prevents 403 errors from mismatched URL params
        if (req.user.role !== 'admin') {
            userIdToUpdate = req.id;
        }

        const { firstName, lastName, address, city, zipCode, state, phone } = req.body

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
        //image upload logic
        if (req.file) {
            // Delete old image if exists
            if (profilePicPublicId) {
                try {
                    await cloudinary.uploader.destroy(profilePicPublicId)
                } catch (error) {
                    console.error("Old profile image cleanup failed:", error.name)
                }
            }


            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "profile" },
                        (error, result) => {
                            if (error) {
                                console.error("Profile image upload failed:", error.name);
                                reject(error)
                            }
                            else resolve(result)
                        }
                    )
                    stream.end(req.file.buffer)
                })

                profilePicUrl = uploadResult.secure_url;
                profilePicPublicId = uploadResult.public_id
            } catch (error) {
                console.error("Profile image upload failed:", error.name);
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
        if (req.user.role === 'admin' && ['user', 'admin'].includes(req.body.role)) {
            user.role = req.body.role
        }
        user.profilePic = profilePicUrl
        user.profilePicPublicId = profilePicPublicId
        const updatedUser = await user.save()
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: { _id: updatedUser._id, firstName: updatedUser.firstName, lastName: updatedUser.lastName, email: updatedUser.email, role: updatedUser.role, profilePic: updatedUser.profilePic, address: updatedUser.address, city: updatedUser.city, state: updatedUser.state, zipCode: updatedUser.zipCode, phone: updatedUser.phone }
        })

    } catch (error) {
        console.error("Profile update failed:", error.name);
        return res.status(500).json({
            success: false,
            message: "The request could not be completed"
        })
    }

}
