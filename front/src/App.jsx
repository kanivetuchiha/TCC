import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cadastrar from "./pages/Cadastro.jsx"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastrar />} />
    </Routes>
  );
}

export default App;
