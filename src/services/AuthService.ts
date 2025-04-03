import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken.";
import { v4 as uuidv4 } from "uuid";
import { ResetToken } from "../models/ResetToken";
import { ResetTypes } from "../enums/User/ResetTypes";

const SECRET_KEY = process.env.JWT_SECRET as string;

class AuthService {
  public async createTokens(
    userId: string,
    userAgent: string,
    ip: string
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const accessToken = jwt.sign({ id: userId, sub: userId }, SECRET_KEY, {
      expiresIn: "15m",
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    const refreshToken = await RefreshToken.findOneAndUpdate(
      { userId, userAgent, ip },
      { token: uuidv4(), expiresAt },
      { new: true, upsert: true }
    );

    return { accessToken, refreshToken: refreshToken.token };
  }

  public async deleteRefreshToken(refreshToken: string): Promise<boolean> {
    const { deletedCount } = await RefreshToken.deleteOne({
      token: refreshToken,
    });
    return deletedCount > 0;
  }

  public async deleteRefreshTokens(userId: string): Promise<boolean> {
    const { deletedCount } = await RefreshToken.deleteMany({ userId });
    return deletedCount > 0;
  }

  public async createResetToken(
    userId: string,
    userAgent: string,
    ip: string,
    type: ResetTypes
  ): Promise<string> {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    const resetToken = await ResetToken.findOneAndUpdate(
      { userId, userAgent, ip, type },
      { token: uuidv4(), expiresAt },
      { new: true, upsert: true }
    );

    return resetToken.token;
  }

  public async deleteToken(resetToken: string): Promise<boolean> {
    const { deletedCount } = await ResetToken.deleteOne({
      token: resetToken,
    });
    return deletedCount > 0;
  }
}

export default new AuthService();
