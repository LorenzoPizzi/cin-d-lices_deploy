import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import profileController from "../controllers/profil.controller.js ";
import { authenticate, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate ,checkRole("admin") ,adminController.showAdminPage);

export default router;
