import express from "express";
import clientRoutes from "./routes/client.routes.js";
import enderecoRoutes from "./routes/endereco.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/clients", clientRoutes);
app.use("/enderecos", enderecoRoutes);
app.use("/compras", comprasRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
