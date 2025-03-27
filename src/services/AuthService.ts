import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken.";
import { v4 as uuidv4 } from "uuid";

const SECRET_KEY = process.env.JWT_SECRET as string;

class AuthService {
  public async createTokens(
    userId: string,
    userAgent: string,
    ip: string
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const accessToken = jwt.sign({ id: userId }, SECRET_KEY, {
      expiresIn: "15m",
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    let refreshToken = await RefreshToken.findOne({ userId, userAgent, ip });

    if (refreshToken) {
      if (refreshToken.expiresAt < new Date()) {
        await RefreshToken.deleteOne({ userId, userAgent, ip });
        refreshToken = null;
      }
    }

    if (refreshToken) {
      refreshToken.token = uuidv4();
      refreshToken.expiresAt = expiresAt;

      await refreshToken.save();
      return { accessToken, refreshToken: refreshToken.token };
    }

    refreshToken = new RefreshToken({
      userId,
      token: uuidv4(),
      expiresAt,
      userAgent,
      ip,
    });

    await refreshToken.save();
    return { accessToken, refreshToken: refreshToken.token };
  }
}

export default new AuthService();
