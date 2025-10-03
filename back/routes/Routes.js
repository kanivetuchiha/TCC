import { Router } from "express";
import controller from "../controllers/controllers.js";

const router = Router();

router.post("/cadastro", controller.CadastrarGado);
router.get("/listar", controller.ListarGado);  
router.patch("/mover", controller.MoverGado);
router.put("/editar/:id", controller.editarGado);
router.delete("/excluir/:id", controller.excluirGado); 

export default router