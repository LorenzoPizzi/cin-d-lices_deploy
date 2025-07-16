import { Category, Recipe, Movie, User } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { unlink } from "fs/promises";
import path from "path";

// Affiche toutes les recettes
export async function showAllRecipes(req, res) {
    try {
        const recipes = await Recipe.findAll({
            include: [
                {
                    association: "movie",
                    attributes: ["title", "id_movie", "type"],
                },
                {
                    association: "categories",
                    attributes: ["name", "id_category"],
                    through: { attributes: [] },
                },
            ],
        });

        const categories = await Category.findAll({
            attributes: ["id_category", "name"],
        });
        const movies = await Movie.findAll({
            attributes: ["id_movie", "title"],
        });

        res.locals.style = "home";
        res.render("home", { recipes, categories, movies });
    } catch (error) {
        console.error("Erreur showAllRecipes :", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            "Erreur lors de la récupération des recettes"
        );
    }
}

// Détail d'une recette
export async function showRecipeDetail(req, res) {
    try {
        const recipe = await Recipe.findByPk(req.params.id, {
            include: [
                { model: Category, as: "categories" },
                { association: "movie", attributes: ["title"] },
            ],
        });

        if (!recipe) {
            return res.status(StatusCodes.NOT_FOUND).render("error", {
                message: "Recette non trouvée.",
                isSuccess: false,
                style: "error",
            });
        }

        const categories = await Category.findAll();
        const movies = await Movie.findAll();
        const user = await User.findByPk(recipe.id_user);

        res.locals.style = "recipedetail";
        res.render("recipeDetail", { recipe, categories, movies, user });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            "Erreur lors de la récupération de la recette"
        );
    }
}

// Formulaire d'ajout
export async function showAddRecipeForm(req, res) {
    res.locals.style = "addrecipe";
    res.render("addrecipe", { recipe: {} });
}

// Ajout d'une recette
export async function addRecipe(req, res) {
    try {
        const {
            name,
            instructions,
            ingredients,
            movie,
            tmdbMovieId,
            category,
            tmdbType,
        } = req.body;

        const userId = req.id_user;
        if (!userId)
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Utilisateur non connecté");

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        let movieEntry = await Movie.findOne({
            where: { tmdb_id: tmdbMovieId },
        });
        if (!movieEntry) {
            movieEntry = await Movie.create({
                title: movie,
                tmdb_id: tmdbMovieId,
                type: tmdbType,
            });
        }

        const categoryLower = category.trim().toLowerCase();
        let categoryEntry = await Category.findOne({
            where: { name: categoryLower },
        });
        if (!categoryEntry) {
            categoryEntry = await Category.create({ name: categoryLower });
        }

        const newRecipe = await Recipe.create({
            id_user: userId,
            name,
            instructions,
            ingredients,
            id_movie: movieEntry.id_movie,
            image_url,
        });

        await newRecipe.addCategory(categoryEntry);

        res.redirect("/");
    } catch (error) {
        console.error("Erreur lors de l'ajout de la recette :", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            "Erreur lors de l'ajout de la recette"
        );
    }
}

// Formulaire de modification
export async function showEditRecipeForm(req, res) {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) return res.status(404).send("Recette non trouvée");

        res.locals.style = "addrecipe";
        res.render("addrecipe", { recipe });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            "Erreur lors de la récupération de la recette"
        );
    }
}

// Modification d'une recette
export async function editRecipe(req, res) {
    try {
        const { name, instructions, ingredients } = req.body;
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe)
            return res
                .status(StatusCodes.NOT_FOUND)
                .send("Recette non trouvée");

        let newImageUrl = recipe.image_url;

        if (req.file) {
            newImageUrl = `/uploads/${req.file.filename}`;

            // Supprimer l’ancienne image si elle existe
            if (recipe.image_url) {
                const oldPath = path.join(
                    process.cwd(),
                    "public",
                    recipe.image_url
                );
                try {
                    await unlink(oldPath);
                    console.log(`Image supprimée : ${oldPath}`);
                } catch (err) {
                    console.warn("Ancienne image non trouvée :", err.message);
                }
            }
        }

        await recipe.update({
            name,
            instructions,
            ingredients,
            image_url: newImageUrl,
        });

        res.redirect("/");
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            "Erreur lors de la modification de la recette"
        );
    }
}

// Suppression d'une recette
export async function deleteRecipe(req, res) {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe)
            return res
                .status(StatusCodes.NOT_FOUND)
                .render("error", { message: "Recette non trouvée" });

        if (recipe.image_url) {
            const filePath = path.join(
                process.cwd(),
                "public",
                recipe.image_url
            );
            try {
                await unlink(filePath);
                console.log(`Image supprimée: ${filePath}`);
            } catch (error) {
                console.warn(
                    "Image non trouvée lors de la suppression :",
                    error.message
                );
            }
        }

        await recipe.destroy();
        res.redirect("/recipes");
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
            message: "Erreur lors de la suppression",
        });
    }
}

// Recherche de recettes (autocomplete)
export async function searchRecipesAutocomplete(req, res) {
    const q = req.query.q || "";
    if (!q) return res.json({ results: [] });

    try {
        const recipes = await Recipe.findAll({
            attributes: ["id_recipe", "name"],
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${q}%` } },
                    { "$movie.title$": { [Op.iLike]: `%${q}%` } },
                ],
            },
            include: [
                {
                    model: Movie,
                    as: "movie",
                    attributes: ["title"],
                    required: true,
                },
            ],
            limit: 10,
        });

        res.json({ results: recipes });
    } catch (error) {
        console.error("Erreur recherche recettes :", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ results: [] });
    }
}
