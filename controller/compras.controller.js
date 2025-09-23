import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const comprasController = {
  async getCompras(req, res) {
    try {
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;

      const compras = await prisma.compra.findMany({
        where: { clienteId: clientId },
        include: {
          itens: {
            include: {
              produto: {
                include: {
                  imagens: true
                }
              },
            },
          },
        },
      });

      return res.json(compras);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve compras" });
    }
  },

  async createCompra(req, res) {
    try {
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;
      const { itens, payment, endereco } = req.body; // <- pega o endereco do frontend

      const itensData = itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnit: item.precoUnit,
      }));

      const newCompra = await prisma.compra.create({
        data: {
          clienteId: clientId,
          itens: { create: itensData },
          payment,
          rua: endereco.rua,
          numero: endereco.numero,
          cidade: endereco.cidade,
          estado: endereco.estado,
          cep: endereco.cep,
        },
        include: { itens: true },
      });

      return res.status(201).json(newCompra);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create compra" });
    }
  },

  async getComprasById(req, res) {
    try {
      const { id } = req.params;
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;

      const compra = await prisma.compra.findUnique({
        where: { id: parseInt(id) },
        include: { itens: true },
      });
      if (!compra) {
        return res.status(404).json({ error: "Compra not found" });
      }
      if (compra.clienteId !== clientId) {
        return res
          .status(403)
          .json({ error: "You can only view your own compras" });
      }

      return res.json(compra);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve compra" });
    }
  },

  async cancelCompra(req, res) {
    try {
      const { id } = req.params;
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;

      const compra = await prisma.compra.findUnique({
        where: { id: parseInt(id) },
      });
      if (!compra) {
        return res.status(404).json({ error: "Compra not found" });
      }
      if (compra.clienteId !== clientId) {
        return res
          .status(403)
          .json({ error: "You can only cancel your own compras" });
      }
      if (compra.status === "CANCELED") {
        return res.status(400).json({ error: "Compra is already canceled" });
      }

      const canceledCompra = await prisma.compra.update({
        where: { id: parseInt(id) },
        data: { status: "CANCELED" },
      });

      return res.json(canceledCompra);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to cancel compra" });
    }
  },

  async updateStatusCompra(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!req.auth || req.auth.role !== "USER") {
        return res
          .status(403)
          .json({ error: "Only users can update compra status" });
      }

      const validStatuses = [
        "PENDING",
        "PAID",
        "SENT",
        "DELIVERED",
        "canceled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const compra = await prisma.compra.findUnique({
        where: { id: parseInt(id) },
      });
      if (!compra) {
        return res.status(404).json({ error: "Compra not found" });
      }

      const updatedCompra = await prisma.compra.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      return res.json(updatedCompra);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update compra status" });
    }
  },
};
