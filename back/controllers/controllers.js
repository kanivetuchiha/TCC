import pkg from "pg";
import { randomUUID } from "crypto";
import multer from "multer";
import fs from "fs";
import path from "path";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fazenda",
  password: "998449598",
  port: 5432,
});

const uploadDir = path.join(process.cwd(), "temp_uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

export const upload = multer({ storage });

const GerarCodigo = () => `boi-${randomUUID().slice(0, 8)}`;

const CarregarGado = async () => {
  try {
    const result = await pool.query("SELECT * FROM bois ORDER BY posicao ASC");
    return result.rows;
  } catch (err) {
    console.error("Erro ao carregar bois:", err);
    return [];
  }
};

const CadastrarGado = async (req, res) => {
  try {
    const { raca, peso, pelagem, tipo } = req.body;
    const codigo_uni = GerarCodigo();

    const imagemBytes = req.file ? fs.readFileSync(req.file.path) : null;

    const result = await pool.query("SELECT COALESCE(MAX(posicao), 0) AS max_posicao FROM bois");
    const novaPosicao = result.rows[0].max_posicao + 1;

    const query = `
      INSERT INTO bois (codigo_uni, raca, peso, pelagem, tipo, posicao, foto)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [codigo_uni, raca, peso, pelagem, tipo, novaPosicao, imagemBytes];
    const inserted = await pool.query(query, values);

    if (req.file) fs.unlinkSync(req.file.path);

    res.json(inserted.rows[0]);
  } catch (err) {
    console.error("Erro ao cadastrar boi:", err);
    res.status(500).json({ message: "Erro ao cadastrar boi", error: err.message });
  }
};

const ListarGado = async (req, res) => {
  try {
    const bois = await CarregarGado();
    res.json(bois);
  } catch (err) {
    console.error("Erro ao listar bois:", err);
    res.status(500).json({ message: "Erro ao listar bois", error: err.message });
  }
};

const editarGado = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE bois
      SET raca = $1, peso = $2, pelagem = $3, tipo = $4
      WHERE boi_id = $5
      RETURNING *;
    `;
    const values = [req.body.raca, req.body.peso, req.body.pelagem, req.body.tipo, id];
    const updated = await pool.query(query, values);

    if (updated.rows.length === 0) return res.status(404).json({ message: "Boi não encontrado" });

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("Erro ao editar boi:", err);
    res.status(500).json({ message: "Erro ao editar boi", error: err.message });
  }
};

const excluirGado = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pool.query("DELETE FROM bois WHERE boi_id = $1 RETURNING *", [id]);
    if (deleted.rows.length === 0) return res.status(404).json({ message: "Boi não encontrado" });
    res.json({ message: "Boi excluído com sucesso", boi: deleted.rows[0] });
  } catch (err) {
    console.error("Erro ao excluir boi:", err);
    res.status(500).json({ message: "Erro ao excluir boi", error: err.message });
  }
};

const MoverGado = async (req, res) => {
  try {
    const { boi_id, novaPosicao } = req.body;
    if (!boi_id || !novaPosicao)
      return res.status(400).json({ message: "boi_id e novaPosicao são obrigatórios" });

    const updateResult = await pool.query(
      "UPDATE bois SET posicao = $1 WHERE boi_id = $2 RETURNING *",
      [novaPosicao, boi_id]
    );
    if (updateResult.rows.length === 0)
      return res.status(404).json({ message: "Boi não encontrado" });

    const boisAtualizados = await CarregarGado();
    res.json({ message: "Boi movido com sucesso", bois: boisAtualizados });
  } catch (err) {
    console.error("Erro ao mover boi:", err);
    res.status(500).json({ message: "Erro ao mover boi", error: err.message });
  }
};

const obterImagem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT foto FROM bois WHERE boi_id = $1", [id]);

    if (result.rows.length === 0 || !result.rows[0].foto) {
      return res.status(404).json({ message: "Imagem não encontrada" });
    }
 

    
    res.setHeader("Content-Type", "image/png");
    res.send(result.rows[0].foto);
  } catch (err) {
    console.error("Erro ao buscar imagem:", err);
    res.status(500).json({ message: "Erro ao buscar imagem", error: err.message });
  }
};


export default {
  CadastrarGado,
  ListarGado,
  MoverGado,
  editarGado,
  excluirGado,
  obterImagem,
};
