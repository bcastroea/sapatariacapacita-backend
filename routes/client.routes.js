import { Router } from "express";
import { clientController } from "../controller/client.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gerenciamento de clientes
 */

/**
 * @swagger
 * /clients/login:
 *   post:
 *     summary: Login do cliente
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: isac@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Retorna o token de autenticação
 *       401:
 *         description: Email ou senha inválidos
 */
router.post("/login", clientController.login);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Criar um novo cliente
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Isac Gama
 *               email:
 *                 type: string
 *                 example: isac@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 */
router.post("/", clientController.createClient);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", authMiddleware, clientController.getClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Buscar cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get("/:id", authMiddleware, clientController.getClientById);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *       404:
 *         description: Cliente não encontrado
 */
router.put("/:id", authMiddleware, clientController.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Deletar cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       204:
 *         description: Cliente deletado
 *       404:
 *         description: Cliente não encontrado
 */
router.delete("/:id", authMiddleware, clientController.deleteClient);

export default router;
