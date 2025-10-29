import "../CSS/Sobre.css";
import { useNavigate } from "react-router-dom";

export default function Sobre() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Sobre</h1>
        <div className="links">
          <a onClick={() => navigate("/galeria")}>Galeria Bovina</a>
          <a onClick={() => navigate("/")}>Home</a>
        </div>
      </nav>

      <section className="texto">
        <h2>
          Desenvolver uma aplicação web interativa, utilizando JavaScript e React.js, 
          integrada a dispositivos Arduino e chips de identificação animal, com o objetivo 
          de realizar o monitoramento de bovinos em uma propriedade rural dentro de um 
          perímetro definido.
        </h2>
      </section>

      <section className="texto objetivos">
        <h2>Objetivos do Projeto</h2>
        <ul>
          <li>Projetar e implementar a interface do sistema utilizando React.js;</li>
          <li>Desenvolver a lógica em JavaScript para comunicação com os dispositivos de leitura de chips;</li>
          <li>Configurar módulos Arduino e sensores para detecção da passagem dos animais;</li>
          <li>Integrar o sistema de hardware (Arduino) com a aplicação web em tempo real;</li>
          <li>Validar o funcionamento em ambiente simulado para demonstrar a viabilidade técnica;</li>
          <li>Avaliar os benefícios da automação no controle e manejo do rebanho rural.</li>
        </ul>
      </section>
    </div>
  );
}
