import { produtosController } from "../controller/produtos.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         tipo:
 *           type: string
 *           nullable: true
 *         cor:
 *           type: string
 *           nullable: true
 *         stars:
 *           type: number
 *           format: float
 *           nullable: true
 *         qtdEstoque:
 *           type: integer
 *         qtdVendido:
 *           type: integer
 *         qtdAvaliacao:
 *           type: integer
 *         descricao:
 *           type: string
 *           nullable: true
 *         precos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Preco'
 *         imagens:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Imagem'
 *         tamanhos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tamanho'
 *
 *     Preco:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         semDesconto:
 *           type: number
 *         aVista:
 *           type: number
 *         parcelamentos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Parcelamento'
 *
 *     Parcelamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         parcelas:
 *           type: integer
 *         valor:
 *           type: number
 *
 *     Imagem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         data:
 *           type: string
 *           format: byte
 *
 *     Tamanho:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         numero:
 *           type: integer
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 */
router.get("/", produtosController.getProdutos);

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
router.get("/:id", produtosController.getProdutoById);

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       403:
 *         description: Somente usuários podem criar produtos
 */
router.post(
  "/",
  authMiddleware,
  authorize(["USER"]),
  produtosController.createProduto,
);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
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
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
router.put(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  produtosController.updateProduto,
);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Produtos]
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
 *         description: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  produtosController.deleteProduto,
);

export default router;
