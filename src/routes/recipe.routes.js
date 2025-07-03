import { Router } from "express";
import recipeController from "../controllers/recipe.controller.js";


const router = Router();

router.get("/", recipeController.showAllRecipes);

router.get("/:id", recipeController.showRecipeDetail);

router.get("/add", /* authMiddleware, */ recipeController.showAddRecipeForm);

router.post("/add", /* authMiddleware, */ recipeController.addRecipe);

router.get("/:id/edit", /* authMiddleware, */ recipeController.showEditRecipeForm);

router.post("/:id/edit", /* authMiddleware, */ recipeController.editRecipe);

router.post("/:id/delete", /* authMiddleware, */ recipeController.deleteRecipe);


export default router;