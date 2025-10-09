import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cadastrar from "./pages/Cadastro.jsx"
import Sobre from "./pages/Sobre.jsx"
import Galeria from "./pages/Galeria.jsx"
import Login from "./pages/Login.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastrar />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/galeria" element={<Galeria />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
