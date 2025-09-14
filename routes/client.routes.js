import { Router } from "express"
import { clientController } from "../controller/client.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// Login do cliente
router.post("/login", clientController.login)

// Criar um novo cliente
router.post("/", clientController.createClient)

// Rotas protegidas (só com token)
router.get("/", authMiddleware, clientController.getClients)
router.get("/:id", authMiddleware, clientController.getClientById)
router.put("/:id", authMiddleware, clientController.updateClient)
router.delete("/:id", authMiddleware, clientController.deleteClient)

export default router
