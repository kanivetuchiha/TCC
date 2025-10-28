import "../CSS/Galeria.css";
import { useNavigate } from "react-router-dom";
export default function Sobre() {

    const navigate = useNavigate();

    return (
        <div className="container">
        <nav className="navbar">
    <h1>Sobre</h1>
    <div className="links">
      <a href="" onClick={() => navigate("/galeria")}>Galeria Bovina</a>
      <a href="" onClick={() => navigate("/")}>HOME</a>
    </div>
  </nav>
    </div>
    )
}