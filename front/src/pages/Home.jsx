import "../CSS/home.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const [BoiClicado, setBoiClicado] = useState(null);
  const [bois, setBois] = useState([]);
  const [formData, setFormData] = useState({
    raca: "",
    peso: "",
    pelagem: "",
    tipo: "",
  });
  const [novaPosicao, setNovaPosicao] = useState("");
  const navigate = useNavigate();


  const getPiquete = (posicao) => Math.ceil(posicao / 10);

  const click = () => {
    navigate("/cadastro");
  };

  const recebeDados = async () => {
    try {
      const api = await fetch("http://localhost:3000/listar");
      const data = await api.json();
      setBois(data);
    } catch (err) {
      alert("Erro ao receber dados do servidor");
      console.error(err);
    }
  };

  useEffect(() => {
    recebeDados();
  }, []);

  const abrirModal = (boi) => {
    setBoiClicado(boi);
    setFormData({
      raca: boi.raca,
      peso: boi.peso,
      pelagem: boi.pelagem,
      tipo: boi.tipo,
    });
    setNovaPosicao(getPiquete(boi.posicao)); 
  };

  const deletar = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este boi?")) return;

    try {
      await fetch(`http://localhost:3000/excluir/${id}`, {
        method: "DELETE",
      });
      setBois((prev) => prev.filter((boi) => boi.boi_id !== id));
      setBoiClicado(null);
    } catch (err) {
      console.error("Erro ao excluir boi:", err);
      alert("Erro ao excluir boi");
    }
  };

  const editar = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const atualizado = await response.json();
      setBois((prev) =>
        prev.map((boi) => (boi.boi_id === id ? atualizado : boi))
      );
      setBoiClicado(atualizado);
    } catch (err) {
      console.error("Erro ao editar boi:", err);
      alert("Erro ao editar boi");
    }
  };

  const mover = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/mover`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boi_id: id,
          novaPosicao: parseInt(novaPosicao),
        }),
      });

      const atualizado = await response.json();
      setBois(atualizado.bois);
      setBoiClicado(null);
    } catch (err) {
      console.error("Erro ao mover boi:", err);
      alert("Erro ao mover boi");
    }
  };

  return (
    <div className="container">
      <button className="botao_add" onClick={click}>
        adicionar gado
      </button>

      
      <div id="terreno">
        {[1, 2, 3, 4].map((piquete) => (
          <div key={piquete} className="piquetes">
            <h3>Piquete {piquete}</h3>
            <div className="bois-container">
              {bois
                .filter((boi) => getPiquete(boi.posicao) === piquete)
                .map((boi) => (
                  <button
                    key={boi.boi_id}
                    className="boi"
                    onClick={() => abrirModal(boi)}
                  >
                    
                  </button>
                ))}
              {bois.filter((boi) => getPiquete(boi.posicao) === piquete)
                .length === 0 && <p className="vazio">Sem bois aqui</p>}
            </div>
          </div>
        ))}
      </div>

      
      {BoiClicado && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{BoiClicado.nome || "Boi"}</h2>
            <p>ID: {BoiClicado.boi_id}</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                editar(BoiClicado.boi_id);
              }}
            >
              <label>
                Raça:
                <input
                  type="text"
                  value={formData.raca}
                  onChange={(e) =>
                    setFormData({ ...formData, raca: e.target.value })
                  }
                />
              </label>
              <label>
                Peso (Kg):
                <input
                  type="number"
                  value={formData.peso}
                  onChange={(e) =>
                    setFormData({ ...formData, peso: e.target.value })
                  }
                />
              </label>
              <label>
                Pelagem:
                <input
                  type="text"
                  value={formData.pelagem}
                  onChange={(e) =>
                    setFormData({ ...formData, pelagem: e.target.value })
                  }
                />
              </label>
              <label>
                Tipo:
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value })
                  }
                />
              </label>

              <div className="actions">
                <button type="submit" className="botao_editar">
                  Salvar alterações
                </button>
              </div>
            </form>

            
            <div className="mover-section">
              <label>
                Novo piquete:
                <select
                  value={novaPosicao}
                  onChange={(e) => setNovaPosicao(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {[1, 2, 3, 4].map((piquete) => (
                    <option
                      key={piquete}
                      value={piquete}
                      disabled={
                        bois.filter(
                          (b) => getPiquete(b.posicao) === piquete
                        ).length >= 10
                      }
                    >
                      Piquete {piquete} (
                      {bois.filter((b) => getPiquete(b.posicao) === piquete)
                        .length}
                      /10)
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="botao_mover"
                onClick={() => mover(BoiClicado.boi_id)}
              >
                Mover
              </button>
            </div>

            <button
              className="botao_deletar"
              onClick={() => deletar(BoiClicado.boi_id)}
            >
              Excluir
            </button>

            <button
              className="botao_fechar"
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
