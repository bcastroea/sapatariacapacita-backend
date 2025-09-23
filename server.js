import express from "express";
import clientRoutes from "./routes/client.routes.js";
import enderecoRoutes from "./routes/endereco.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import produtoRoutes from "./routes/produtos.routes.js";
import userRoutes from "./routes/user.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import cors from "cors"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [ 
    'http://localhost:3001', 
    'http://localhost:3000' 
  ]
}));

// Rotas da aplicação
app.use("/clients", clientRoutes);
app.use("/enderecos", enderecoRoutes);
app.use("/compras", comprasRoutes);
app.use("/produtos", produtoRoutes);
app.use("/user", userRoutes);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
      description: "API do meu projeto com Prisma + Express",
    },
    servers: [{ url: process.env.BASE_URL || `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Função para criar usuário admin caso não exista nenhum usuário
async function seedAdminUser() {
  const usersCount = await prisma.usuario.count();

  if (usersCount === 0) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@meusistema.com";
    const adminNome = process.env.ADMIN_NAME || "Admin";
    const adminSenha = process.env.ADMIN_PASSWORD || "admin123";

    const hashedPassword = await bcrypt.hash(adminSenha, 10);

    const adminUser = await prisma.usuario.create({
      data: {
        nome: adminNome,
        email: adminEmail,
        senha: hashedPassword,
      },
    });

    console.log("Usuário admin seed criado:", adminUser.email);
  } else {
    console.log("Usuários já existem, seed não necessário");
  }
}

// Inicializa servidor com seed
async function startServer() {
  try {
    await seedAdminUser();

    app.listen(PORT, () => {
      console.log(
        `Server rodando em: ${process.env.BASE_URL || `http://localhost:${PORT}`}`
      );
      console.log(
        `Swagger UI: ${process.env.BASE_URL || `http://localhost:${PORT}`}/api-docs`
      );
    });
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

startServer();
