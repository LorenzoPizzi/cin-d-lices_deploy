import { Router } from "express";
import { showAdminPage } from "../controllers/admin.controller.js";
import { authenticate, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, checkRole("admin"), showAdminPage);

export default router;
