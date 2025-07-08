import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import profileController from "../controllers/profil.controller.js ";

const router = Router();

router.get("/", adminController.showAdminPage);
router.post('admin/users/:id/delete', profileController.deleteProfile);


export default router;

