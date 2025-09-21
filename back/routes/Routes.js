import { Router } from "express";
import controller from "../controllers/controllers.js";

const router = Router();

router.post("/cadastro", controller.CadastrarGado);
router.get("/listar", controller.ListarGado);  
router.post("/mover", controller.MoverGado); 

export default router