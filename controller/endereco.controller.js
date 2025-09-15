import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const enderecoController = {
  async createEndereco(req, res) {
    try {
      const { rua, numero, cidade, estado, cep } = req.body;
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;

      const newEndereco = await prisma.endereco.create({
        data: { rua, numero, cidade, estado, cep, clienteId: clientId },
      });

      return res.status(201).json(newEndereco);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create endereco" });
    }
  },

  async getEnderecos(req, res) {
    try {
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;

      const enderecos = await prisma.endereco.findMany({
        where: { clienteId: clientId },
      });

      return res.json(enderecos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve enderecos" });
    }
  },

  async getEnderecoById(req, res) {
    try {
      const { id } = req.params;
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;

      const endereco = await prisma.endereco.findUnique({
        where: { id: parseInt(id) },
      });
      if (!endereco) {
        return res.status(404).json({ error: "Endereco not found" });
      }
      if (endereco.clienteId !== clientId) {
        return res
          .status(403)
          .json({ error: "You can only view your own enderecos" });
      }

      return res.json(endereco);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve endereco" });
    }
  },

  async deleteEndereco(req, res) {
    try {
      const { id } = req.params;
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;

      const endereco = await prisma.endereco.findUnique({
        where: { id: parseInt(id) },
      });
      if (!endereco) {
        return res.status(404).json({ error: "Endereco not found" });
      }
      if (endereco.clienteId !== clientId) {
        return res
          .status(403)
          .json({ error: "You can only delete your own enderecos" });
      }

      await prisma.endereco.delete({
        where: { id: parseInt(id) },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete endereco" });
    }
  },

  async updateEndereco(req, res) {
    try {
      const { id } = req.params;
      const { rua, numero, cidade, estado, cep } = req.body;
      if (!req.auth || !req.auth.clientId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const clientId = req.auth.clientId;

      const endereco = await prisma.endereco.findUnique({
        where: { id: parseInt(id) },
      });
      if (!endereco) {
        return res.status(404).json({ error: "Endereco not found" });
      }
      if (endereco.clienteId !== clientId) {
        return res
          .status(403)
          .json({ error: "You can only update your own enderecos" });
      }

      const updatedEndereco = await prisma.endereco.update({
        where: { id: parseInt(id) },
        data: { rua, numero, cidade, estado, cep },
      });

      return res.json(updatedEndereco);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update endereco" });
    }
  },
};
