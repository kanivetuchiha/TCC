import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Cadastrar from "./cadastro.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastrar />} />
    </Routes>
  );
}

export default App;
