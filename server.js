import express from "express";
import clientRoutes from "./routes/client.routes.js";
import enderecoRoutes from "./routes/endereco.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import produtoRoutes from "./routes/produtos.routes.js";
import userRoutes from "./routes/user.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  apis: ["./routes/*.js"], // Swagger vai ler os comentários das rotas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Inicia o servidor
app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`,
  );
  console.log(
    `Swagger UI: ${process.env.BASE_URL || `http://localhost:${PORT}`}/api-docs`,
  );
});
