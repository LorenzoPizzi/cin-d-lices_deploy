import { Router } from "express";
import recipeRoutes from "./recipe.routes.js"; 
import categoryRoutes from "./category.routes.js";
import apiRoutes from "./api.routes.js";


const router = Router();

router.use("/", recipeRoutes); 

router.use("/categories", categoryRoutes);

router.use("/api", apiRoutes);  


export default router;
