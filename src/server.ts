import logger from "./config/logger";
import { ApiEnviroment } from "./enums/Api/ApiEnviroment";
import app from "./routes";
import { generateASCII } from "./utils/nameGenerator";
import { connectDB, disconnectDB } from "./database/connection";
import { config } from "dotenv";
import packageJson from "../package.json";

config();

const API_NAME: string = packageJson.name;
const APP_VERSION: string = packageJson.version;
const API_VERSION: string = "v" + (process.env.API_VERSION || "1"); 
const ENVIRONMENT: string = process.env.ENVIRONMENT === "dev" ? ApiEnviroment.DEV : ApiEnviroment.PROD; 
const PORT: number = Number(process.env.PORT) || 8088;

const stopServer = async () => {
  logger.warn("Parando a aplicação...");
  await disconnectDB();
  logger.warn("Conexão com o banco de dados encerrada");
  logger.end();

  setTimeout(() => {
    process.exit(0);
  }, 1000);
};

function getHorizontalSize(asciiArt: string): number {
  const size = Math.max(...asciiArt.split("\n").map((line) => line.length));
  return size;
}

const startServer = async () => {
  try {
    const asciiArt = await generateASCII(API_NAME);

    console.log("Conectando com o banco de dados...");
    await connectDB();
    const horizontalSize = getHorizontalSize(asciiArt) + 1;

    console.log(asciiArt);
    console.log("=".repeat(horizontalSize));
    console.log(`Versão do app: ${APP_VERSION}`);
    console.log(`Versão API: ${API_VERSION}`);
    console.log(`Ambiente: ${ENVIRONMENT}`);
    console.log("=".repeat(horizontalSize));

    app.listen(PORT, () => {
      logger.info(`Aplicação iniciada com sucesso!`);
    });
  } catch (err) {
    logger.error(`Erro ao iniciar aplicação: ${err}`);
    stopServer();
  }
};

startServer();
