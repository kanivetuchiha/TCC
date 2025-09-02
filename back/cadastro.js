import Gado from "./bois.json" assert { type: "json" }
import { readFileSync, writeFileSync } from "fs";


const gerarCodigo = function () {
  return "boi-" + Math.random().toString(16).substring(2, 10);
}

export function cadastrarGado(novoBoi) {
  

  const data = JSON.parse(readFileSync("bois.json", "utf-8"));


  const novoId = data.bois.length > 0 ? data.bois[data.bois.length - 1].id + 1 : 1;

  const boi = {
    id: novoId,
    codigo_uni: gerarCodigo(),
    raca: novoBoi.raca,
    peso: novoBoi.peso,
    pelagem: novoBoi.pelagem,
    tipo: novoBoi.tipo,
  };


  data.bois.push(boi);

 
  writeFileSync("bois.json", JSON.stringify(data, null, 2), "utf-8");

  return boi;
}

