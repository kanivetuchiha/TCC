import { Router } from "express";
import controller, { upload } from "../controllers/controllers.js";

const router = Router();

router.post("/cadastro", upload.single("imagem"), controller.CadastrarGado);
router.get("/listar", controller.ListarGado);
router.patch("/mover", controller.MoverGado);
router.put("/editar/:id", controller.editarGado);
router.delete("/excluir/:id", controller.excluirGado);
router.get("/foto/:id", controller.obterImagem);

export default router;