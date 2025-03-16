import mongoose from "mongoose";

import { config } from "dotenv";
import logger from "../config/logger";
config();

const MONGO_URI = process.env.MONGO_URI as string;

if(!MONGO_URI){
    throw new Error("MONGO_URI não está definido no .env");
}

export const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI, {
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000
        });
    
        console.log("Conexão realizada com sucesso!");

        //monitorando a conexão
        mongoose.connection.on("connected", () =>
          logger.info("Mongoose conectado!")
        );
        mongoose.connection.on("error", (err) =>
          logger.error("Erro no Mongoose: ", err)
        );
        mongoose.connection.on("disconnected", () =>
          logger.warn("Mongoose desconectado!")
        );

        //tenta reconectar caso a conexão seja perdida
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.warn("Conexão com MongoDB fechada! Saindo");
        });
    }
    catch(error){
        throw new Error(`Erro ao conectar ao banco de dados: ${error}`);
    }
}

export const disconnectDB = async () => {
    try{
        await mongoose.disconnect();
        logger.warn("Conexão com MongoDB fechada! Saindo");
    }
    catch(error){
        logger.error("Erro ao fechar a conexão com o banco de dados:", error)
    }
}