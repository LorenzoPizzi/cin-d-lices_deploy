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
import { authenticate, checkOwner } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/myprofile/:id", authenticate, checkOwner, showProfile);
router.put("/:id", authenticate, checkOwner, updateProfile);
router.post("/:id/delete", authenticate, checkOwner, deleteProfile);
router.post(
    "/:id/upload-picture",
    authenticate,
    checkOwner,
    upload.single("picture"),
    uploadPicture
);
router.get("/confirm/:token", confirmEmail);

export default router;
