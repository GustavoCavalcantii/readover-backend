import fs from "fs/promises";
import Logger from "../config/Logger";

export async function ensureExists(uploadDir: string) {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    Logger.error("Erro ao criar a pasta", err);
  }
}
