import { Router } from "express";
import recipeRoutes from "./recipe.routes.js";
import categoryRoutes from "./category.routes.js";
import authRoutes from "./auth.routes.js";
import apiRoutes from "./api.routes.js";


const router = Router();

router.use("/", authRoutes);
router.use("/recipes", recipeRoutes); 
router.use("/categories", categoryRoutes);
router.use("/api", apiRoutes); 
router.get("/", (req, res) => {
    res.redirect("/recipes");
}); 


export default router;
