import { enderecoController } from "../controller/endereco.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Endereços
 *   description: Gerenciamento de endereços do cliente
 */

/**
 * @swagger
 * /enderecos:
 *   get:
 *     summary: Listar endereços do cliente autenticado
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de endereços
 *       401:
 *         description: Não autorizado
 */
router.get("/", authMiddleware, enderecoController.getEnderecos);

/**
 * @swagger
 * /enderecos/{id}:
 *   get:
 *     summary: Buscar endereço pelo ID
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *       403:
 *         description: Não autorizado a ver este endereço
 *       404:
 *         description: Endereço não encontrado
 */
router.get("/:id", authMiddleware, enderecoController.getEnderecoById);

/**
 * @swagger
 * /enderecos:
 *   post:
 *     summary: Criar um novo endereço para o cliente autenticado
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rua
 *               - numero
 *               - cidade
 *               - estado
 *               - cep
 *             properties:
 *               rua:
 *                 type: string
 *                 example: Rua das Flores
 *               numero:
 *                 type: string
 *                 example: "123"
 *               cidade:
 *                 type: string
 *                 example: Recife
 *               estado:
 *                 type: string
 *                 example: PE
 *               cep:
 *                 type: string
 *                 example: "50000-000"
 *     responses:
 *       201:
 *         description: Endereço criado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post("/", authMiddleware, enderecoController.createEndereco);

/**
 * @swagger
 * /enderecos/{id}:
 *   put:
 *     summary: Atualizar um endereço do cliente autenticado
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rua:
 *                 type: string
 *               numero:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               cep:
 *                 type: string
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *       403:
 *         description: Não autorizado a atualizar este endereço
 *       404:
 *         description: Endereço não encontrado
 */
router.put("/:id", authMiddleware, enderecoController.updateEndereco);

/**
 * @swagger
 * /enderecos/{id}:
 *   delete:
 *     summary: Deletar um endereço do cliente autenticado
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     responses:
 *       204:
 *         description: Endereço deletado com sucesso
 *       403:
 *         description: Não autorizado a deletar este endereço
 *       404:
 *         description: Endereço não encontrado
 */
router.delete("/:id", authMiddleware, enderecoController.deleteEndereco);

export default router;
