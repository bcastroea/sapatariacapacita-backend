import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const produtosController = {
  async getProdutos(req, res) {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          precos: { include: { parcelamentos: true } },
          imagens: { select: { id: true } },
          tamanhos: true,
          compras: { include: { produto: true } },
        },
        orderBy: { id: "asc" },
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

      const { nome, tipo, cor, stars, qtdEstoque, descricao, preco } = req.body;

      const imagensData =
        req.files?.map((file) => ({ data: file.buffer })) || [];

      const tamanhos = [];
      for (const key in req.body) {
        const match = key.match(/^tamanhos\[(\d+)\]\[numero\]$/);
        if (match) {
          tamanhos.push({ numero: parseInt(req.body[key]) });
        }
      }

      const precoCheio = parseFloat(preco);
      const precoPix = +(precoCheio * 0.95).toFixed(2);

      const parcelamentos = [
        { parcelas: 3, valor: +(precoCheio / 3).toFixed(2) },
        { parcelas: 6, valor: +(precoCheio / 6).toFixed(2) },
        { parcelas: 12, valor: +(precoCheio / 12).toFixed(2) },
      ];

      const newProduto = await prisma.produto.create({
        data: {
          nome,
          tipo,
          cor,
          stars: stars ? parseFloat(stars) : 0,
          qtdEstoque: qtdEstoque ? parseInt(qtdEstoque) : 0,
          descricao,
          imagens: { create: imagensData },
          tamanhos: { create: tamanhos },
          precos: {
            create: {
              semDesconto: precoCheio,
              aVista: precoPix,
              parcelamentos: {
                create: parcelamentos,
              },
            },
          },
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

      const { nome, tipo, cor, stars, qtdEstoque, descricao, removeImagens } =
        req.body;

      const updatedData = {};
      if (nome) updatedData.nome = nome;
      if (tipo) updatedData.tipo = tipo;
      if (cor) updatedData.cor = cor;
      if (stars != null) updatedData.stars = parseFloat(stars);
      if (qtdEstoque != null) updatedData.qtdEstoque = parseInt(qtdEstoque);
      if (descricao) updatedData.descricao = descricao;

      // 🔑 Remover imagens antigas (se IDs forem enviados pelo front)
      if (removeImagens) {
        const ids = Array.isArray(removeImagens)
          ? removeImagens.map((i) => parseInt(i))
          : [parseInt(removeImagens)];

        await prisma.imagem.deleteMany({
          where: { id: { in: ids }, produtoId: id },
        });
      }

      // 🔑 Adicionar novas imagens
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

  async getImagem(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid image ID" });
      }

      const imagem = await prisma.imagem.findUnique({
        where: { id },
        select: { data: true },
      });

      if (!imagem) {
        return res.status(404).json({ error: "Image not found" });
      }

      // Configurar headers para imagem
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache de 1 ano

      return res.send(imagem.data);
    } catch (error) {
      console.error("Error retrieving image:", error);
      return res.status(500).json({ error: "Failed to retrieve image" });
    }
  },
};
