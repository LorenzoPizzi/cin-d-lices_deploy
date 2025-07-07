import express from "express";
import profileController from "../controllers/profil.controller.js";

const router = express.Router();

router.get("/", profileController.getAllProfiles);
router.get("/myprofile/:id", profileController.myProfile);
router.put("/:id", profileController.updateProfile);
router.delete("/:id", profileController.deleteProfile);

export default router;
