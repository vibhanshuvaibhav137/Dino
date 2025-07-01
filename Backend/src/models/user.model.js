import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";

/**
 * User Schema for browser-based authentication
 * Each browser gets a unique user profile
 */
const userSchema = new Schema({
  browserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  browserFingerprint: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  highScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update last active timestamp on save
userSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});




userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model('User', userSchema);