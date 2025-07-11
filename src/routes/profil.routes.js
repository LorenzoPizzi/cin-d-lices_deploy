import express from "express";
import profileController from "../controllers/profil.controller.js";
import { confirmEmail } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", profileController.getAllProfiles);
router.get("/myprofile/:id",authenticate ,profileController.showProfile);
router.put("/:id", authenticate,profileController.updateProfile);
router.post("/:id/delete", authenticate,profileController.deleteProfile);
router.get("/confirm/:token", confirmEmail);

export default router;


