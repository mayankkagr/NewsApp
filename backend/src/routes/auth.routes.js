import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login",authController.login);
router.get("/health", authController.health);

export default router;