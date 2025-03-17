import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/IUser";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);   
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;