import { Router } from "express";
import recipeRoutes from "./recipe.routes.js";
import categoryRoutes from "./category.routes.js";
import authRoutes from "./auth.routes.js";
import apiRoutes from "./api.routes.js";
import adminRoutes from "./admin.routes.js";
import profileRoutes from "./profil.routes.js";
import contactRoutes from "./contact.routes.js";
import legalRoutes from "./legal.routes.js";

const router = Router();

router.use("/", authRoutes);
router.use("/recipes", recipeRoutes);
router.use("/categories", categoryRoutes);
router.use("/api", apiRoutes);
router.use("/profiles", profileRoutes);
router.use("/admin", adminRoutes);
router.use("/contact", contactRoutes);
router.use("/legal", legalRoutes);

router.get("/", (req, res) => {
    res.redirect("/recipes");
});

export default router;
