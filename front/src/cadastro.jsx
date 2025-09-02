import { useNavigate } from "react-router-dom";
import "./CSS/cadastro.css"

export default function Cadastro (){

 const navigate = useNavigate();
    const click = function () {
        navigate("/")
    }

    return(
        <div className="container">
            <div className="card-center">
<form>
<label>insira a raça</label><br/>
<input/> <br/>

<label>insira o peso</label><br/>
<input/> <br/>

<label>insira a pelagem</label><br/>
<input/> <br/>

<label>insira o tipo</label><br/>
<input/> <br/>

    <button type="submint" onClick={click}>SALVAR</button>
</form>

            </div>
        </div>
    )
}