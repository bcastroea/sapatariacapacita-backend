import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const produtosController = {
  async getProdutos(req, res) {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          precos: { include: { parcelamentos: true } },
          imagens: true,
          tamanhos: true,
          compras: { include: { produto: true } },
        },
      });
      return res.json(produtos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve produtos" });
    }
  },

  async getProdutoById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid produto ID" });

      const produto = await prisma.produto.findUnique({
        where: { id },
        include: {
          precos: { include: { parcelamentos: true } },
          imagens: true,
          tamanhos: true,
          compras: { include: { produto: true } },
        },
      });

      if (!produto) return res.status(404).json({ error: "Produto not found" });
      return res.json(produto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve produto" });
    }
  },

  async createProduto(req, res) {
    try {
      if (!req.auth || req.auth.role !== "USER") {
        return res
          .status(403)
          .json({ error: "Only users can create produtos" });
      }

      const {
        nome,
        tipo,
        cor,
        stars,
        qtdEstoque,
        descricao,
        precos,
        tamanhos,
      } = req.body;

      const imagensData =
        req.files?.map((file) => ({ data: file.buffer })) || [];

      const newProduto = await prisma.produto.create({
        data: {
          nome,
          tipo,
          cor,
          stars,
          qtdEstoque,
          descricao,
          precos: {
            create:
              precos?.map((preco) => ({
                semDesconto: preco.semDesconto,
                aVista: preco.aVista,
                parcelamentos: {
                  create:
                    preco.parcelamentos?.map((p) => ({
                      parcelas: p.parcelas,
                      valor: p.valor,
                    })) || [],
                },
              })) || [],
          },
          imagens: { create: imagensData },
          tamanhos: { create: tamanhos || [] },
        },
        include: {
          precos: { include: { parcelamentos: true } },
          imagens: true,
          tamanhos: true,
        },
      });

      return res.status(201).json(newProduto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create produto" });
    }
  },

  async updateProduto(req, res) {
    try {
      if (!req.auth || req.auth.role !== "USER") {
        return res
          .status(403)
          .json({ error: "Only users can update produtos" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid produto ID" });

      const { nome, tipo, cor, stars, qtdEstoque, descricao } = req.body;
      const updatedData = {};
      if (nome) updatedData.nome = nome;
      if (tipo) updatedData.tipo = tipo;
      if (cor) updatedData.cor = cor;
      if (stars != null) updatedData.stars = stars;
      if (qtdEstoque != null) updatedData.qtdEstoque = qtdEstoque;
      if (descricao) updatedData.descricao = descricao;

      const imagensData = req.files?.map((file) => ({ data: file.buffer }));
      if (imagensData?.length) {
        updatedData.imagens = { create: imagensData };
      }

      const updatedProduto = await prisma.produto.update({
        where: { id },
        data: updatedData,
        include: {
          precos: { include: { parcelamentos: true } },
          imagens: true,
          tamanhos: true,
        },
      });

      return res.json(updatedProduto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update produto" });
    }
  },

  async deleteProduto(req, res) {
    try {
      if (!req.auth || req.auth.role !== "USER") {
        return res
          .status(403)
          .json({ error: "Only users can delete produtos" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid produto ID" });

      await prisma.produto.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete produto" });
    }
  },
};
