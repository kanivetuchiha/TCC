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


const ListarGado = async (req,res) => {
  try {
    const bois = await CarregarGado();
    res.json(bois);
  } catch (err) {
    console.error("Erro ao listar bois:", err);
    return [];
  }
};


const MoverGado = async (req, res, posicaoAtual, novaPosicao) => {
  try {
    const bois = await CarregarGado();

    
    arrayMoveMutable(bois, posicaoAtual, novaPosicao);


    for (let i = 0; i < bois.length; i++) {
      await pool.query(
        "UPDATE bois SET posicao = $1 WHERE id = $2",
        [i + 1, bois[i].id]
      );
    }

    res.json(bois);
  } catch (err) {
    console.error("Erro ao mover boi:", err);
    throw err;
  }
};


export default { CadastrarGado, ListarGado, MoverGado };
