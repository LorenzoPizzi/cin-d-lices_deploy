import { Category, Recipe, Movie } from "../models/index.js";
import { Op } from "sequelize";

const recipeController = {

    showAllRecipes: async (req, res) => {
        try {
            const recipes = await Recipe.findAll({
                include: [
                    {
                        association: "movie",
                        attributes: ["title", "id_movie"],
                    },
                    {
                        association: "categories",
                        attributes: ["name", "id_category"],
                        through: { attributes: [] },
                    },
                ],
            });

            
            const categories = await Category.findAll({
                attributes: ["id_category", "name"]
            });

            const movies = await Movie.findAll({
                attributes: ["id_movie", "title"]
            });

            res.render("home", { recipes, categories, movies });
        } catch (error) {
            console.error("Erreur showAllRecipes :", error);
            res.status(500).send("Erreur lors de la récupération des recettes");
        }
    },

    showRecipeDetail: async (req, res) => {
        try {
            const recipe = await Recipe.findByPk(req.params.id, {
                include: [
                    {
                        model: Category,
                        as: "categories",
                    },
                    {
                        association: "movie",
                        attributes: ["title"],
                    },
                ],
            });
            console.log("Recette trouvée :", req.params.id);
            if (!recipe) {
                return res.status(404).send("Recette non trouvée");
            }

            
            const categories = await Category.findAll();
            const movies = await Movie.findAll();

            res.render("recipeDetail", { recipe, categories, movies });
        } catch (error) {
            res.status(500).send("Erreur lors de la récupération de la recette");
        }
    },

    showAddRecipeForm: (req, res) => {
        res.render("addrecipe", { recipe: {} });
    },

    addRecipe: async (req, res) => {
        try {
            const {
                name,
                instructions,
                ingredients,
                movie,
                tmdbMovieId,
                category,
            } = req.body;
            const image_url = req.file ? `/uploads/${req.file.filename}` : null;

            let movieEntry = await Movie.findOne({
                where: { tmdb_id: tmdbMovieId },
            });

            if (!movieEntry) {
                movieEntry = await Movie.create({
                    title: movie,
                    tmdb_id: tmdbMovieId,
                });
            }

            let categoryEntry = await Category.findOne({
                where: { name: category },
            });

            if (!categoryEntry) {
                categoryEntry = await Category.create({
                    name: category,
                });
            }

            const newRecipe = await Recipe.create({
                id_user: 1,
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
            res.status(500).send("Erreur lors de l'ajout de la recette");
        }
    },

    showEditRecipeForm: async (req, res) => {
        try {
            const recipe = await Recipe.findByPk(req.params.id);
            if (!recipe) return res.status(404).send("Recette non trouvée");
            res.render("addrecipe", { recipe });
        } catch (error) {
            res.status(500).send("Erreur lors de la récupération de la recette");
        }
    },

    editRecipe: async (req, res) => {
        try {
            const { name, instructions, ingredients, image_url } = req.body;
            const recipe = await Recipe.findByPk(req.params.id);
            if (!recipe) return res.status(404).send("Recette non trouvée");

            await recipe.update({ name, instructions, ingredients, image_url });
            res.redirect("/admin");
        } catch (error) {
            console.error("Erreur lors de la modification :", error);
            res.status(500).send("Erreur lors de la modification de la recette");
        }
    },

    deleteRecipe: async (req, res) => {
        try {
            const recipe = await Recipe.findByPk(req.params.id);
            if (!recipe) return res.status(404).send("Recette non trouvée");
            await recipe.destroy();
            res.redirect("/admin");
        } catch (error) {
            res.status(500).send("Erreur lors de la suppression de la recette");
        }
    },

    searchRecipesAutocomplete: async (req, res) => {
        const q = req.query.q || "";
        if (!q) return res.json({ results: [] });

        try {
            const recipes = await Recipe.findAll({
                attributes: ['id_recipe', 'name'],
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${q}%` } },
                        { '$movie.title$': { [Op.iLike]: `%${q}%` } }
                    ]
                },
                include: [{
                    model: Movie,
                    as: 'movie',
                    attributes: ['title'],
                    required: true
                }],
                limit: 10
            });

            res.json({ results: recipes });
        } catch (error) {
            console.error("Erreur recherche recettes :", error);
            res.status(500).json({ results: [] });
        }
    },

};

export default recipeController;
