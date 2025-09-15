import { Router } from "express";
import { comprasController } from "../controller/compras.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, comprasController.getCompras);
router.get("/:id", authMiddleware, comprasController.getComprasById);
router.post("/", authMiddleware, comprasController.createCompra);
router.put("/:id/cancel", authMiddleware, comprasController.cancelCompra);

router.put(
  "/:id/status",
  authMiddleware,
  authorize(["USER"]),
  comprasController.updateStatusCompra,
);

export default router;
