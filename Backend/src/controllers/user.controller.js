import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";



// Generate unique browser ID based on request headers and IP
const generateBrowserId = (req) => {
    const userAgent = req.get('User-Agent') || '';
    const acceptLanguage = req.get('Accept-Language') || '';
    const acceptEncoding = req.get('Accept-Encoding') || '';
    const ip = req.ip || req.connection.remoteAddress;
    
    const fingerprint = `${userAgent}-${acceptLanguage}-${acceptEncoding}-${ip}`;
    return crypto.createHash('sha256').update(fingerprint).digest('hex');
};


// Generate Access Token
const generateAccessToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()

        user.accessToken = accessToken
        await user.save({ validateBeforeSave: false })

        return accessToken

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


// User Profile
const userProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select("-browserFingerprint");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {
        id: user._id,
        browserId: user.browserId,
        gamesPlayed: user.gamesPlayed,
        highScore: user.highScore,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
        }, "User profile fetched successfully")
    );
});


// Register or login browser-based user
const registerUser = asyncHandler(async (req, res) => {
    const browserId = generateBrowserId(req);
    const userAgent = req.get("User-Agent") || "";
    const browserFingerprint = req.body.fingerprint || browserId;

    let user = await User.findOne({ browserId });

    if(user){
        user.lastActive = new Date();
        await user.save();

        const token = await generateAccessToken(user._id);
        return res.status(200).json(
        new ApiResponse(200, {
            user: {
            id: user._id,
            browserId: user.browserId,
            gamesPlayed: user.gamesPlayed,
            highScore: user.highScore,
            createdAt: user.createdAt,
            },
            token,
        }, "User already exists, logged in successfully")
        );
    }

    user = await User.findOne({ browserId });
    if (!user) {
        user = await User.create({
            browserId,
            browserFingerprint,
            userAgent,
        });
    }

    const token = await generateAccessToken(user._id);

    return res.status(201).json(
        new ApiResponse(201, {
        user: {
            id: user._id,
            browserId: user.browserId,
            gamesPlayed: user.gamesPlayed,
            highScore: user.highScore,
            createdAt: user.createdAt,
        },
        token,
        }, "User registered successfully")
    );
});


// Login existing user
const loginUser = asyncHandler(async (req, res) => {
    const browserId = generateBrowserId(req);
    let user = await User.findOne({ browserId });

    if (!user) {
        const userAgent = req.get("User-Agent") || "";
        const browserFingerprint = req.body.fingerprint || browserId;

        user = await User.create({
            browserId,
            browserFingerprint,
            userAgent,
        });
    }

    user.lastActive = new Date();
    await user.save();

    const token = await generateAccessToken(user._id);

    return res.status(200).json(
        new ApiResponse(200, {
        user: {
            id: user._id,
            browserId: user.browserId,
            gamesPlayed: user.gamesPlayed,
            highScore: user.highScore,
            createdAt: user.createdAt,
        },
        token,
        }, "Login successful")
    );
});

export { registerUser, loginUser, userProfile };