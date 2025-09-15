import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const userController = {
  async createUser(req, res) {
    try {
      if (!req.auth || req.auth.role !== "USER") {
        return res
          .status(403)
          .json({ error: "Only users can create new users" });
      }
      const { nome, email, senha, role = "USER" } = req.body;

      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const newUser = await prisma.usuario.create({
        data: { nome, email, senha: senhaCriptografada, role: "USER" },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create user" });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const user = await prisma.usuario.findUnique({ where: { email } });

      if (!user)
        return res.status(401).json({ error: "Invalid email or password" });

      const senhaValida = await bcrypt.compare(senha, user.senha);
      if (!senhaValida)
        return res.status(401).json({ error: "Invalid email or password" });

      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Listar todos os usuários (somente USER)
  async getUsers(req, res) {
    try {
      if (!req.auth || req.auth.role !== "USER") {
        return res
          .status(403)
          .json({ error: "Only users can access user list" });
      }

      const users = await prisma.usuario.findMany();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve users" });
    }
  },

  // Buscar usuário por ID (só o próprio ou USER)
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      if (!req.auth) return res.status(401).json({ error: "Unauthorized" });

      const userId = parseInt(id);
      if (req.auth.role !== "USER" && req.auth.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const user = await prisma.usuario.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to retrieve user" });
    }
  },

  // Atualizar usuário (só próprio ou USER)
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
      const userId = parseInt(id);
      if (req.auth.role !== "USER" && req.auth.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const updatedData = {};
      if (nome) updatedData.nome = nome;
      if (email) updatedData.email = email;
      if (senha) updatedData.senha = await bcrypt.hash(senha, 10);

      const updatedUser = await prisma.usuario.update({
        where: { id: userId },
        data: updatedData,
      });

      return res.json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update user" });
    }
  },

  // Deletar usuário (só próprio ou USER)
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
      const userId = parseInt(id);
      if (req.auth.role !== "USER" && req.auth.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await prisma.usuario.delete({ where: { id: userId } });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  },
};
