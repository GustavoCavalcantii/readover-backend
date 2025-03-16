import logger from "../config/logger";
import { ApiEnviroment } from "../enum/Api/ApiEnviroment";
import app from "../routes/app";
import {generateASCII} from "../utils/nameGenerator"

import { connectDB, disconnectDB } from "../database/connection";

import { config } from "dotenv";
config();

const API_NAME: string = process.env.APP_NAME as string;
const API_VERSION: string = process.env.API_VERSION as string;
const ENVIROMENT: string = process.env.ENVIROMENT === "dev" ? ApiEnviroment.DEV : ApiEnviroment.PROD;
const PORT: number = Number(process.env.PORT) || 8088;

const stopServer = async () => 
{
  logger.warn("Parando a aplicação...");
  await disconnectDB();
  logger.warn("Conexão com o banco de dados encerrada");
  logger.end();

  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

function getHorizontalSize(asciiArt: string): number {
  return Math.max(...asciiArt.split("\n").map((line) => line.length));
}

const startServer = async () => {
  try {
    const asciiArt = await generateASCII(API_NAME);

    console.log("Conectando com o banco de dados...");
    await connectDB();
    const horizontaSize = getHorizontalSize(asciiArt) + 1;

    console.log(asciiArt);
    console.log("=".repeat(horizontaSize));
    console.log(`Versão: ${API_VERSION}`);
    console.log(`Ambiente: ${ENVIROMENT}`);
    console.log("=".repeat(horizontaSize));

    app.listen(PORT, () => {
      logger.info(`Aplicação inciada com sucesso!`);
    });
  } catch (err) {
    logger.error(`Erro ao iniciar aplicação: ${err}`);
    stopServer();
  }
};

startServer();