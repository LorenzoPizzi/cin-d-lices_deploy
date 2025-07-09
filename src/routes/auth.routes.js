import { Router } from "express";
import { login, register, logout } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", (req, res) => {
    res.locals.style = 'login';
    res.render("login");
});
router.post("/login", login);
router.get("/register", (req, res) => {
    res.locals.style = 'register';
    res.render("register");
});
router.post("/register", register);
router.get("/logout", logout);

export default router;