import { Router } from "express";
import recipeRoutes from "./recipe.routes.js";
import categoryRoutes from "./category.routes.js";
import apiRoutes from "./api.routes.js";
import profileRoutes from "./profil.routes.js";

const router = Router();

router.use("/recipes", recipeRoutes);

router.use("/categories", categoryRoutes);

router.use("/api", apiRoutes);

router.use("/profiles", profileRoutes);

router.get("/", (req, res) => {
  res.redirect("/recipes");
});

export default router;
