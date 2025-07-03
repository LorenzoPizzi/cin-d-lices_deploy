import { Router } from "express";
import recipeRoutes from "./recipe.routes.js"; 


const router = Router();

router.use("/", recipeRoutes); 

export default router;
