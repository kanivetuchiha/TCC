import "../CSS/home.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const [BoiClicado, setBoiClicado] = useState(null);
  const [bois, setBois] = useState([]); // estado para armazenar os dados do fetch

  const navigate = useNavigate();

  const click = () => {
    navigate("/cadastro");
  };

  // função para buscar dados da API
  const recebeDados = async () => {
    try {
      const api = await fetch("http://localhost:3000/listar");
      const data = await api.json();
      setBois(data); // salva no estado
      console.log(data);
    } catch (err) {
      alert("Erro ao receber dados do servidor");
      console.error(err);
    }
  };

  // busca os dados apenas uma vez quando o componente é montado
  useEffect(() => {
    recebeDados();
  }, []);

  return (
    <div className="container">
      <button className="btn-add" onClick={click}>
        adicionar gado
      </button>

      <div id="terreno">
        <div className="piquetes">
          {bois.map((boi) => (
            <button
              key={boi.boi_id}
              className="boi"
              onClick={() => setBoiClicado(boi)}
            ></button>
          ))}
        </div>
        <div className="piquetes"></div>
        <div className="piquetes"></div>
        <div className="piquetes"></div>
      </div>

      {BoiClicado && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{BoiClicado.nome}</h2>
            <p>ID: {BoiClicado.boi_id}</p>
            <p>Raça: {BoiClicado.raca}</p>
            <p>Peso: {BoiClicado.peso} Kg</p>
            <p>Pelagem: {BoiClicado.pelagem}</p>
            <p>Tipo: {BoiClicado.tipo}</p>
            <div className="actions">
              <button className="btn delete">Excluir</button>
              <button className="btn edit">Editar</button>
              <button className="btn move">Mover</button>
            </div>
            <button
              className="btn-close"
              onClick={() => setBoiClicado(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
