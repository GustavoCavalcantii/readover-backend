import mongoose from "mongoose";

const ResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String, required: true },
    ip: { type: String, required: true },
    type: { type: String, require: true },
  },
  { timestamps: true }
);

export const ResetToken = mongoose.model("ResetToken", ResetTokenSchema);
