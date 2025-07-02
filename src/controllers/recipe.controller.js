import { Recipe, User, Movie, Category } from "../models/index.js";

export async function getAllRecipes(req, res) {
  try {
    const recipes = await Recipe.findAll({
      include: [User, Movie, Category],
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function getRecipeById(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [User, Movie, Category],
    });
    if (!recipe) return res.status(404).json({ error: "Recette non trouvée" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createRecipe(req, res) {
  try {
    const newRecipe = await Recipe.create(req.body);
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateRecipe(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recette non trouvée" });
    await recipe.update(req.body);
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteRecipe(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recette non trouvée" });
    await recipe.destroy();
    res.json({ message: "Recette supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 