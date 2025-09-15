import { userController } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         senha:
 *           type: string
 *           description: Senha criptografada
 *         role:
 *           type: string
 *           enum: [USER]
 *
 *     UserRegister:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         senha:
 *           type: string
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *         senha:
 *           type: string
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login de um usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email ou senha inválidos
 */
router.post(
  "/login",
  authMiddleware,
  authorize(["USER"]),
  userController.login,
);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Apenas usuários autenticados podem registrar
 */
router.post(
  "/register",
  authMiddleware,
  authorize(["USER"]),
  userController.createUser,
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", authMiddleware, authorize(["USER"]), userController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  userController.getUserById,
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.put(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  userController.updateUser,
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário deletado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  userController.deleteUser,
);

export default router;
