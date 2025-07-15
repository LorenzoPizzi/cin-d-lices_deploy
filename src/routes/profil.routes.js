import express from "express";
import {
    deleteProfile,
    getAllProfiles,
    showProfile,
    updateProfile,
} from "../controllers/profil.controller.js";
import { confirmEmail } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/myprofile/:id", authenticate, showProfile);
router.put("/:id", authenticate, updateProfile);
router.post("/:id/delete", authenticate, deleteProfile);
router.get("/confirm/:token", confirmEmail);

export default router;
