import { Router } from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from "../controllers/recipe.controller.js";

const router = Router();

// GET /recipes - toutes les recettes
router.get("/", getAllRecipes);

// GET /recipes/:id - une recette par ID
router.get("/:id", getRecipeById);

// POST /recipes - créer une recette
router.post("/", createRecipe);

// PUT /recipes/:id - mettre à jour une recette
router.put("/:id", updateRecipe);

// DELETE /recipes/:id - supprimer une recette
router.delete("/:id", deleteRecipe);

export default router; 