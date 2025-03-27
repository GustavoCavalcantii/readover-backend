import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
});

export const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
