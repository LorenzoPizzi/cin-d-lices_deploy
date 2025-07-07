import { Router } from "express";
import recipeRoutes from "./recipe.routes.js";
import categoryRoutes from "./category.routes.js";

const router = Router();

router.use("/", recipeRoutes);
router.use("/categories", categoryRoutes);

export default router;
