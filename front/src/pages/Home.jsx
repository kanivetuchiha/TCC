import "../CSS/home.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();


  const PIQUETES = 4;
  const CAPACIDADE = 10;


  const [BoiClicado, setBoiClicado] = useState(null);
  const [bois, setBois] = useState([]);
  const [formData, setFormData] = useState({
    raca: "",
    peso: "",
    pelagem: "",
    tipo: "",
  });
  const [novaPiquete, setNovaPiquete] = useState("");
  const [novaPosicaoAbsoluta, setNovaPosicaoAbsoluta] = useState("");

  const getPiquete = (posicao) => Math.ceil(posicao / CAPACIDADE);

  const click = () => navigate("/cadastro");

  // busca dados do servidor
  const recebeDados = async () => {
    try {
      const api = await fetch("http://localhost:3000/listar");
      const data = await api.json();
      if (Array.isArray(data)) setBois(data);
      else if (data.bois) setBois(data.bois);
      else setBois([]);
    } catch (err) {
      alert("Erro ao receber dados do servidor");
      console.error(err);
    }
  };

  useEffect(() => {
    recebeDados();
  }, []);

  // retorna posições livres dentro do piquete
  const getPosicoesLivres = (piquete) => {
    if (!piquete) return [];
    const inicio = (piquete - 1) * CAPACIDADE + 1;
    const fim = piquete * CAPACIDADE;
    const ocupadasSet = new Set(
      bois.filter((b) => b.posicao >= inicio && b.posicao <= fim).map((b) => b.posicao)
    );
    const livres = [];
    for (let i = inicio; i <= fim; i++) {
      if (!ocupadasSet.has(i)) livres.push(i);
    }
    return livres;
  };

  const abrirModal = (boi) => {
    setBoiClicado(boi);
    setFormData({
      raca: boi.raca,
      peso: boi.peso,
      pelagem: boi.pelagem,
      tipo: boi.tipo,
    });
    const piq = getPiquete(boi.posicao);
    setNovaPiquete(piq);
    setNovaPosicaoAbsoluta(boi.posicao);
  };

  const deletar = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este boi?")) return;
    try {
      await fetch(`http://localhost:3000/excluir/${id}`, { method: "DELETE" });
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
      if (atualizado && atualizado.boi_id) {
        setBois((prev) => prev.map((b) => (b.boi_id === id ? atualizado : b)));
        setBoiClicado(atualizado);
      } else {
        await recebeDados();
      }
    } catch (err) {
      console.error("Erro ao editar boi:", err);
      alert("Erro ao editar boi");
    }
  };

  const mover = async (id) => {
    if (!novaPiquete || !novaPosicaoAbsoluta) {
      alert("Selecione um piquete com posição disponível.");
      return;
    }
    try {
      const body = { boi_id: id, novaPosicao: novaPosicaoAbsoluta };
      const response = await fetch("http://localhost:3000/mover", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data && data.bois) setBois(data.bois);
      else await recebeDados();
      setBoiClicado(null);
    } catch (err) {
      console.error("Erro ao mover boi:", err);
      alert("Erro ao mover boi");
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Gerenciamento de Gado</h1>
        <div className="links">
          <a href="" onClick={() => navigate("/galeria")}>galeria bovina</a>
          <a href="" onClick={() => navigate("/sobre")}>Sobre</a>
        </div>
      </nav>

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
                    title={`ID ${boi.boi_id} - pos ${boi.posicao}`}
                  />
                ))}
              {bois.filter((boi) => getPiquete(boi.posicao) === piquete).length === 0 && (
                <p className="vazio">Sem bois aqui</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {BoiClicado && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{BoiClicado.nome || "Boi"}</h2>
            <p>ID: {BoiClicado.boi_id} — posição atual: {BoiClicado.posicao}</p>

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
                  onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                />
              </label>
              <label>
                Peso (Kg):
                <input
                  type="number"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                />
              </label>
              <label>
                Pelagem:
                <input
                  type="text"
                  value={formData.pelagem}
                  onChange={(e) => setFormData({ ...formData, pelagem: e.target.value })}
                />
              </label>
              <label>
                Tipo:
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                />
              </label>

              <div className="actions">
                <button type="submit" className="botao_editar">Salvar alterações</button>
              </div>
            </form>

            <div className="mover-section">
              <label>
                Piquete destino:
                <select
                  value={novaPiquete}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : "";
                    setNovaPiquete(val);
                    const livres = getPosicoesLivres(val);
                    if (BoiClicado && getPiquete(BoiClicado.posicao) === val) {
                      setNovaPosicaoAbsoluta(BoiClicado.posicao);
                    } else {
                      setNovaPosicaoAbsoluta(livres.length ? livres[0] : "");
                    }
                  }}
                >
                  <option value="">Selecione</option>
                  {Array.from({ length: PIQUETES }, (_, i) => i + 1).map((p) => {
                    const livres = getPosicoesLivres(p);
                    const estaNoMesmoPiquete = BoiClicado && getPiquete(BoiClicado.posicao) === p;
                    const disabled = !estaNoMesmoPiquete && livres.length === 0;
                    return (
                      <option key={p} value={p} disabled={disabled}>
                        Piquete {p} ({CAPACIDADE - livres.length}/{CAPACIDADE})
                      </option>
                    );
                  })}
                </select>
              </label>

              <button
                className="botao_mover"
                onClick={() => mover(BoiClicado.boi_id)}
                disabled={!novaPiquete || !novaPosicaoAbsoluta}
              >
                Mover
              </button>
            </div>

            <button className="botao_deletar" onClick={() => deletar(BoiClicado.boi_id)}>Excluir</button>
            <button className="botao_fechar" onClick={() => setBoiClicado(null)}>Fechar</button>
          </div>
        </div>
      )}

      <button className="botao_add" onClick={click}>adicionar gado</button>
    </div>
  );
}
