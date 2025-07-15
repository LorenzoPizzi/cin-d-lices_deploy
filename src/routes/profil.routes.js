import express from "express";

import {
    deleteProfile,
    getAllProfiles,
    showProfile,
    updateProfile,
    uploadPicture,
} from "../controllers/profil.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { confirmEmail } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/myprofile/:id", authenticate, showProfile);
router.put("/:id", authenticate, updateProfile);
router.post("/:id/delete", authenticate, deleteProfile);
router.post("/:id/upload-picture", upload.single("picture"), uploadPicture);
router.get("/confirm/:token", confirmEmail);

export default router;
