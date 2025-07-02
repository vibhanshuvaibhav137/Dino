import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLeaderboard, getUserScores, submitScore, syncOfflineScores } from "../controllers/score.controller.js";

const router = Router();

// Score routes for :
// - submit score
// - sync offline scores
// - get leaderboard
// - get user score

router.post('/', verifyJWT, submitScore)
router.post('/sync', verifyJWT, syncOfflineScores)
router.get('/leaderboard', getLeaderboard)
router.get('/user-score', verifyJWT, getUserScores)

export default router;