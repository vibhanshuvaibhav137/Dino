import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Score } from "../models/score.model.js";
import { User } from "../models/user.model.js";


// Submit Score 
const submitScore = asyncHandler(async (req, res) => {
    const { score, gameData } = req.body;
    const userId = req.user.userId;

    if (!score || score < 0) {
        throw new ApiError(400, "Invalid score data");
    }

    if (!gameData || !gameData.duration) {
        throw new ApiError(400, "Game data is required");
    }

    const newScore = await Score.create({
        userId,
        score,
        gameData: {
        duration: gameData.duration,
        obstaclesHit: gameData.obstaclesHit || 0,
        jumps: gameData.jumps || 0,
        },
        isOnlineScore: true,
    });

    const user = await User.findById(userId);
    if (user) {
        user.gamesPlayed += 1;
        if (score > user.highScore) {
        user.highScore = score;
        }
        await user.save();
    }

    return res.status(201).json(
        new ApiResponse(201, newScore, "Score submitted successfully")
    );
});


// Sync Offline Scores
const syncOfflineScores = asyncHandler(async (req, res) => {
    const { scores } = req.body;
    const userId = req.user.userId;

    if (!scores || !Array.isArray(scores)) {
        throw new ApiError(400, "Invalid scores data");
    }

    const syncedScores = [];

    for (const scoreData of scores) {
        if (scoreData.score && scoreData.gameData) {
        const newScore = await Score.create({
            userId,
            score: scoreData.score,
            gameData: scoreData.gameData,
            isOnlineScore: false,
            syncedAt: new Date(),
        });
        syncedScores.push(newScore);
        }
    }

    const user = await User.findById(userId);
    if (user) {
        user.gamesPlayed += syncedScores.length;
        const maxScore = Math.max(...syncedScores.map((s) => s.score));
        if (maxScore > user.highScore) {
        user.highScore = maxScore;
        }
        await user.save();
    }

    return res.status(200).json(
        new ApiResponse(
        200,
        { syncedCount: syncedScores.length },
        `${syncedScores.length} scores synced successfully`
        )
    );
});


// Get Leaderboard
const getLeaderboard = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const leaderboard = await Score.aggregate([
        {
            $group: {
                _id: "$userId",
                maxScore: { $max: "$score" },
                totalGames: { $sum: 1 },
                avgScore: { $avg: "$score" },
            },
        },
        {
            $sort: { maxScore: -1 } 
        },
        {
            $skip: skip 
        },
        { 
            $limit: limit 
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $project: {
                maxScore: 1,
                totalGames: 1,
                avgScore: { $round: ["$avgScore", 2] },
                user: { $arrayElemAt: ["$user", 0] },
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            leaderboard,
            pagination: {
                page,
                limit,
                total: leaderboard.length,
            },
        }, "Leaderboard fetched successfully")
    );
});

// Get User Score
const getUserScores = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const scores = await Score.find({ userId })
        .sort({ score: -1 })
        .skip(skip)
        .limit(limit);

    const totalScores = await Score.countDocuments({ userId });

    return res.status(200).json(
        new ApiResponse(200, {
            scores,
            pagination: {
                page,
                limit,
                total: totalScores,
                pages: Math.ceil(totalScores / limit),
            },
        }, "User scores fetched successfully")
    );
});

export {
    submitScore,
    syncOfflineScores,
    getLeaderboard,
    getUserScores,
};
