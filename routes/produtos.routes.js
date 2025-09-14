import { produtosController } from "../controller/produtos.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

import express from "express";

const router = express.Router();

router.get("/", produtosController.getProdutos);
router.get("/:id", produtosController.getProdutoById);
router.post(
  "/",
  authMiddleware,
  authorize(["USER"]),
  produtosController.createProduto,
);
router.put(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  produtosController.updateProduto,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  produtosController.deleteProduto,
);

export default router;