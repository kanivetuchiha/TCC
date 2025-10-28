import { useEffect, useState } from "react";
import "../CSS/Galeria.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Galeria() {
  const navigate = useNavigate();
  const [bois, setBois] = useState([]);

  // Função para carregar bois com foto
  const carregarBois = async () => {
    try {
      const res = await axios.get("http://localhost:3000/listar");
      // Mapeia apenas codigo_uni e boi_id (para construir URL da foto)
      const boisComFoto = res.data.map((boi) => ({
        codigo_uni: boi.codigo_uni,
        boi_id: boi.boi_id,
      }));
      setBois(boisComFoto);
    } catch (err) {
      console.error("Erro ao carregar bois:", err);
    }
  };

  useEffect(() => {
    carregarBois();
  }, []);

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Galeria Bovina</h1>
        <div className="links">
          <a href="" onClick={() => navigate("/")}>HOME</a>
          <a href="" onClick={() => navigate("/sobre")}>Sobre</a>
        </div>
      </nav>

      <div className="galeria">
        {bois.length === 0 ? (
          <p>Nenhum boi cadastrado.</p>
        ) : (
          bois.map((boi) => (
            <div className="card" key={boi.boi_id}>
              <img
                src={`http://localhost:3000/foto/${boi.boi_id}`}
                alt={`Boi ${boi.codigo_uni}`}
                className="boi-foto"
              />
              <p>{boi.codigo_uni}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
