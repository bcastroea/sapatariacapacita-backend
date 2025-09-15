import { userController } from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

import express from "express";
const router = express.Router();

router.post(
  "/login",
  authMiddleware,
  authorize(["USER"]),
  userController.login,
);
router.post(
  "/register",
  authMiddleware,
  authorize(["USER"]),
  userController.createUser,
);
router.post(
  "/",
  authMiddleware,
  authorize(["USER"]),
  userController.createUser,
);
router.get("/", authMiddleware, authorize(["USER"]), userController.getUsers);
router.get(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  userController.getUserById,
);
router.put(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  userController.updateUser,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(["USER"]),
  userController.deleteUser,
);

export default router;
