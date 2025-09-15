import { Router } from "express";
import { comprasController } from "../controller/compras.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: Gerenciamento de compras
 */

/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Listar compras do cliente autenticado
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de compras
 *       401:
 *         description: Não autorizado
 */
router.get("/", authMiddleware, comprasController.getCompras);

/**
 * @swagger
 * /compras/{id}:
 *   get:
 *     summary: Buscar compra pelo ID
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da compra
 *     responses:
 *       200:
 *         description: Compra encontrada
 *       403:
 *         description: Não autorizado a ver esta compra
 *       404:
 *         description: Compra não encontrada
 */
router.get("/:id", authMiddleware, comprasController.getComprasById);

/**
 * @swagger
 * /compras:
 *   post:
 *     summary: Criar uma nova compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                       example: 1
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *                     precoUnit:
 *                       type: number
 *                       example: 99.9
 *     responses:
 *       201:
 *         description: Compra criada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post("/", authMiddleware, comprasController.createCompra);

/**
 * @swagger
 * /compras/{id}/cancel:
 *   put:
 *     summary: Cancelar uma compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da compra
 *     responses:
 *       200:
 *         description: Compra cancelada
 *       400:
 *         description: Compra já está cancelada
 *       403:
 *         description: Não autorizado a cancelar esta compra
 *       404:
 *         description: Compra não encontrada
 */
router.put("/:id/cancel", authMiddleware, comprasController.cancelCompra);

/**
 * @swagger
 * /compras/{id}/status:
 *   put:
 *     summary: Atualizar o status de uma compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PAID, SENT, DELIVERED, CANCELED]
 *                 example: PAID
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Status inválido
 *       403:
 *         description: Apenas usuários com papel USER podem atualizar o status
 *       404:
 *         description: Compra não encontrada
 */
router.put(
  "/:id/status",
  authMiddleware,
  authorize(["USER"]),
  comprasController.updateStatusCompra,
);

export default router;
