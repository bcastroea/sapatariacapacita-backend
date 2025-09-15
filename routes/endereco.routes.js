import { enderecoController } from "../controller/endereco.controller";
import { authMiddleware } from "../middleware/auth.middleware";

import express from "express";
const router = express.Router();

router.get("/", authMiddleware, enderecoController.getEnderecos);
router.get("/:id", authMiddleware, enderecoController.getEnderecoById);
router.post("/", authMiddleware, enderecoController.createEndereco);
router.put("/:id", authMiddleware, enderecoController.updateEndereco);
router.delete("/:id", authMiddleware, enderecoController.deleteEndereco);

export default router;