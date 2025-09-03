import cors from "cors";
import express from "express";
import Routes from "./routes/routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/listar", Routes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});