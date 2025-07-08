import { Router } from "express";
import { login, register, logout } from "../controllers/auth.controller.js";

const router = Router();

router.get('/login', (req, res) => {
    res.render('loginpage');
});
router.post("/login", login);
router.get('/register', (req, res) => {
    res.render('registerpage');
});
router.post("/register", register);
router.get("/logout", logout);

export default router;