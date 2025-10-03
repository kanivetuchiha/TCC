import pkg from "pg";
import { randomUUID } from "crypto";
import { arrayMoveMutable } from "array-move";

const { Pool } = pkg;


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fazenda",
  password: "998449598",
  port: 5432, 
});


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

    const novoBoi = req.body;
    const codigo_uni = GerarCodigo();

   
    const result = await pool.query(
      "SELECT COALESCE(MAX(posicao), 0) AS max_posicao FROM bois"
    );
    const novaPosicao = result.rows[0].max_posicao + 1;

    const query = `
      INSERT INTO bois (codigo_uni, raca, peso, pelagem, tipo, posicao)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    
    const values = [
      codigo_uni,
      novoBoi.raca,
      novoBoi.peso,
      novoBoi.pelagem,
      novoBoi.tipo,
      novaPosicao,
    ];


    const inserted = await pool.query(query, values);
    res.json(inserted.rows[0]);
  } catch (err) {
    console.error("Erro ao cadastrar boi:", err);
    throw err;
  }
};

const excluirGado = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await pool.query(
      "DELETE FROM bois WHERE boi_id = $1 RETURNING *",
      [id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: "Boi não encontrado" });
    }

    res.json({ message: "Boi excluído com sucesso", boi: deleted.rows[0] });
  } catch (err) {
    console.error("Erro ao excluir boi:", err);
    res.status(500).json({ message: "Erro ao excluir boi", error: err.message });
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

    const values = [
      req.body.raca ?? req.body.raca,
      req.body.peso ?? req.body.peso,
      req.body.pelagem ?? req.body.pelagem,
      req.body.tipo ?? req.body.tipo,
      id
    ];

    const updated = await pool.query(query, values);

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: "Boi não encontrado" });
    }

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("Erro ao editar boi:", err);
    res.status(500).json({ message: "Erro ao editar boi", error: err.message });
  }
};


const ListarGado = async (req,res) => {
  try {
    const bois = await CarregarGado();
    res.json(bois);
  } catch (err) {
    console.error("Erro ao listar bois:", err);
    return [];
  }
};


const MoverGado = async (req, res) => {
  try {
    const { boi_id, novaPosicao } = req.body; 

    if (!boi_id || !novaPosicao) {
      return res.status(400).json({ message: "boi_id e novaPosicao são obrigatórios" });
    }


    const bois = await CarregarGado();


    const posicaoAtual = bois.findIndex((b) => b.boi_id === boi_id);
    if (posicaoAtual === -1) {
      return res.status(404).json({ message: "Boi não encontrado" });
    }

    arrayMoveMutable(bois, posicaoAtual, novaPosicao - 1);

   
    for (let i = 0; i < bois.length; i++) {
      await pool.query(
        "UPDATE bois SET posicao = $1 WHERE boi_id = $2",
        [i + 1, bois[i].boi_id]
      );
    }

    const atualizados = await CarregarGado();
    res.json({ message: "Boi movido com sucesso", bois: atualizados });
  } catch (err) {
    console.error("Erro ao mover boi:", err);
    res.status(500).json({ message: "Erro ao mover boi", error: err.message });
  }
};



export default { CadastrarGado, ListarGado, MoverGado, editarGado, excluirGado };
