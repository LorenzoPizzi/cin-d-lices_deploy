import { Router } from "express";
import { login, register, logout } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);

export default router;
