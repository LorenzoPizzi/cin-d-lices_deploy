import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

const router = Router();

router.get("/", adminController.showAdminPage);

export default router;

