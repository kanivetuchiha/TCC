import "./CSS/global.css"
import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();
    const click = function () {
        navigate("/cadastro")
    }

    return (
        <div className="container">
            <button onClick={click}>adicionar gado</button>

            <div id="terreno">
                <div className="piquetes"></div>
                <div className="piquetes"></div>
                <div className="piquetes"></div>
                <div className="piquetes"></div>
            </div>
        </div>
    );
}