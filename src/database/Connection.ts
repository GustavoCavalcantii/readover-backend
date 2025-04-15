import mongoose from "mongoose";

import { config } from "dotenv";
import Logger from "../config/Logger";
config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/readover-db";

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
          Logger.info("Mongoose conectado!")
        );
        mongoose.connection.on("error", (err) =>
          Logger.error("Erro no Mongoose: ", err)
        );
        mongoose.connection.on("disconnected", () =>
          Logger.warn("Mongoose desconectado!")
        );

        //tenta reconectar caso a conexão seja perdida
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            Logger.warn("Conexão com MongoDB fechada! Saindo");
        });
    }
    catch(error){
        throw new Error(`Erro ao conectar ao banco de dados: ${error}`);
    }
}

export const disconnectDB = async () => {
    try{
        await mongoose.disconnect();
        Logger.warn("Conexão com MongoDB fechada! Saindo");
    }
    catch(error){
        Logger.error("Erro ao fechar a conexão com o banco de dados:", error)
    }
}