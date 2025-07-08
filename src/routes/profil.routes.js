import express from "express";
import profileController from "../controllers/profil.controller.js";

const router = express.Router();

router.get("/", profileController.getAllProfiles);
router.get("/myprofile/:id", profileController.showProfile);
router.put("/:id", profileController.updateProfile);
router.post("/:id/delete", profileController.deleteProfile);
/* router.get("/profile/confirm/:token", confirmEmail); */

export default router;
