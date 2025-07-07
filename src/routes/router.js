import { Router } from "express";
import recipeRoutes from "./recipe.routes.js";
import categoryRoutes from "./category.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/", authRoutes);
router.use("/", recipeRoutes);
router.use("/categories", categoryRoutes);

export default router;
