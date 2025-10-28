import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/cadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();

  const [raca, setRaca] = useState("");
  const [peso, setPeso] = useState(0);
  const [pelagem, setPelagem] = useState("");
  const [tipo, setTipo] = useState("");
  const [imagem, setImagem] = useState(null); 
  const [resposta, setResposta] = useState(null);

  const enviarDados = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("raca", raca);
      formData.append("peso", peso);
      formData.append("pelagem", pelagem);
      formData.append("tipo", tipo);
      if (imagem) formData.append("imagem", imagem);

      const res = await axios.post("http://localhost:3000/cadastro", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResposta(res.data);
      navigate("/");
    } catch (err) {
      console.error("Erro ao enviar:", err);
    }
  };

  return (
    <div className="container">
      <div className="card-center">
        <form onSubmit={enviarDados}>
          <label>Insira a raça</label><br/>
          <input
            type="text"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
            placeholder="Digite a raça"
          /> <br/>

          <label>Insira o peso</label><br/>
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(Number(e.target.value))}
            placeholder="Digite o peso em Kg"
          /> <br/>

          <label>Insira a pelagem</label><br/>
          <input
            type="text"
            value={pelagem}
            onChange={(e) => setPelagem(e.target.value)}
            placeholder="Digite a pelagem"
          /> <br/>

          <label>Insira o tipo</label><br/>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Digite o tipo"
          /> <br/>

<label>Selecione a imagem</label><br/>
<input
  type="file"
  accept="image/*"
  onChange={(e) => setImagem(e.target.files[0])}
/>
{imagem && <p className="file-name">Arquivo selecionado: {imagem.name}</p>}
 <br/>

          <button type="submit">SALVAR</button>
        </form>
      </div>
    </div>
  );
}