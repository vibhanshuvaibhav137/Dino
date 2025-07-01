import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


// Score Schema for storing game scores

const scoreSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    gameData: {
      obstaclesHit: {
        type: Number,
        default: 0
      },
      jumps: {
        type: Number,
        default: 0
      }
    },
    isOnlineScore: {
      type: Boolean,
      default: true
    },
    syncedAt: {
      type: Date,
      default: Date.now
    }
}, {
    timestamps: true
});

scoreSchema.plugin(mongooseAggregatePaginate)

// Index for leaderboard queries
scoreSchema.index({ score: -1 });
scoreSchema.index({ userId: 1, score: -1 });

export const Score = mongoose.model('Score', scoreSchema);