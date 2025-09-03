import { Router } from "express";
import controller from "../controllers/controllers.js";

const router = Router();

router.post("/cadastro", controller.cadastrarGado);
router.get("/listar", controller.listarGado);  
router.post("/mover", controller.MoverGado); 

export default router