import { Router } from "express";
import recipeController from "../controllers/recipe.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", recipeController.showAllRecipes);

router.get("/add", /* authenticate*/ recipeController.showAddRecipeForm);

router.get("/:id", recipeController.showRecipeDetail);

router.post("/add", authenticate, recipeController.addRecipe);

router.get("/:id/edit", authenticate, recipeController.showEditRecipeForm);

router.post("/:id/edit", authenticate, recipeController.editRecipe);

router.post("/:id/delete", authenticate, recipeController.deleteRecipe);

export default router;
