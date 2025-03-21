import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "../interfaces/IUser";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  accessLevel: { type: Number, default: 0, required: false },
  grade: { type: String, required: false },
  passwordResetToken: { type: String, required: false },
  emprestimosAtivos: { type: [Types.ObjectId], ref: "Loan" },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
