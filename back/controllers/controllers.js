import { readFileSync, writeFileSync } from "fs";
import { arrayMoveMutable } from "array-move";

const gerarCodigo = () => {
  return "boi-" + Math.random().toString(16).substring(2, 10);
};


const carregarDados = () => {
  return JSON.parse(readFileSync("bois.json", "utf-8"));
};


const salvarDados = (data) => {
  writeFileSync("bois.json", JSON.stringify(data, null, 2), "utf-8");
};


const cadastrarGado = (novoBoi) => {
  const data = carregarDados();

  const novoId =
    data.bois.length > 0 ? data.bois[data.bois.length - 1].id + 1 : 1;

  const boi = {
    id: novoId,
    codigo_uni: gerarCodigo(),
    raca: novoBoi.raca,
    peso: novoBoi.peso,
    pelagem: novoBoi.pelagem,
    tipo: novoBoi.tipo,
  };

  data.bois.push(boi);
  salvarDados(data);

  return boi;
};


const listarGado = () => {
  const data = carregarDados();
  return data.bois;
};


const MoverGado = (posicaoAtual, novaPosicao) => {
  const data = carregarDados();

  arrayMoveMutable(data.bois, posicaoAtual, novaPosicao);

  salvarDados(data);
  return data.bois;
};

export default { cadastrarGado, listarGado, MoverGado };
