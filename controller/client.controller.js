import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const clientController = {
  // GET /clients
  async getClients(req, res) {
    try {
      if (req.auth.role === "CLIENT") {
        const client = await prisma.cliente.findUnique({
          where: { id: req.auth.clientId },
        });
        return client
          ? res.json(client)
          : res.status(404).json({ error: "Client not found" });
      }

      const clients = await prisma.cliente.findMany();
      return res.json(clients);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /clients
  async createClient(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const newClient = await prisma.cliente.create({
        data: { nome, email, senha: senhaCriptografada },
      });

      return res.status(201).json(newClient);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /login-client
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const client = await prisma.cliente.findUnique({ where: { email } });

      if (!client)
        return res.status(401).json({ error: "Invalid email or password" });

      const senhaValida = await bcrypt.compare(senha, client.senha);
      if (!senhaValida)
        return res.status(401).json({ error: "Invalid email or password" });

      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");

      const token = jwt.sign(
        { clientId: client.id, role: "CLIENT" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET /clients/:id
  async getClientById(req, res) {
    try {
      const { id } = req.params;
      const clientId = Number(id);
      if (isNaN(clientId))
        return res.status(400).json({ error: "Invalid client ID" });

      if (req.auth.role === "CLIENT" && req.auth.clientId !== clientId) {
        return res
          .status(403)
          .json({ error: "You can only view your own account" });
      }

      const client = await prisma.cliente.findUnique({
        where: { id: clientId },
        include: { enderecos: true },
      });

      if (!client) return res.status(404).json({ error: "Client not found" });

      return res.json(client);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT /clients/:id
  async updateClient(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      const clientId = Number(id);
      if (isNaN(clientId))
        return res.status(400).json({ error: "Invalid client ID" });

      if (req.auth.role === "CLIENT" && req.auth.clientId !== clientId) {
        return res
          .status(403)
          .json({ error: "You can only update your own account" });
      }

      const updatedData = {};
      if (nome) updatedData.nome = nome;
      if (email) updatedData.email = email;
      if (senha) updatedData.senha = await bcrypt.hash(senha, 10);

      const updatedClient = await prisma.cliente.update({
        where: { id: clientId },
        data: updatedData,
      });

      return res.json(updatedClient);
    } catch (error) {
      console.error(error);
      if (error.code === "P2025")
        return res.status(404).json({ error: "Client not found" });
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // DELETE /clients/:id
  async deleteClient(req, res) {
    try {
      const { id } = req.params;
      const clientId = Number(id);
      if (isNaN(clientId))
        return res.status(400).json({ error: "Invalid client ID" });

      if (req.auth.role === "CLIENT" && req.auth.clientId !== clientId) {
        return res
          .status(403)
          .json({ error: "You can only delete your own account" });
      }

      await prisma.cliente.delete({ where: { id: clientId } });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      if (error.code === "P2025")
        return res.status(404).json({ error: "Client not found" });
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
