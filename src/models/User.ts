import mongoose, { Schema, Types, CallbackError  } from "mongoose";
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

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("senha")) return next(); 

  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();
    
  } catch (error : unknown) {

    const err = error as CallbackError;
    next(err);
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IUser>;

  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
    } catch (error) {
      return next(error as CallbackError);
    }
  }

  next();
});

userSchema.methods.comparePassword = async function (senha: string) {
  return bcrypt.compare(senha, this.senha);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
