import express from "express";
import { handleContactForm } from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("contactpage");
});
router.post("/", handleContactForm);

export default router;
