import express from "express";

const app = express();

const PORT = 8088;

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
})