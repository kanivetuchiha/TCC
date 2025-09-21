import cors from "cors";
import express from "express";
import Routes from "./routes/Routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/", Routes);
app.get("/", (req, res) => {
  res.send("API de Gerenciamento de Gado");
}
  )

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});