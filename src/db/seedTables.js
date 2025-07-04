import {
    sequelize,
    User,
    Role,
    Movie,
    Recipe,
    Category,
    RecipeCategory,
} from "../models/index.js";

async function seedTables() {
    try {
        const now = new Date();

        // 1. Création des rôles
        const adminRole = await Role.create({
            roleName: "admin",
        });
        const userRole = await Role.create({
            roleName: "user",
        });

        // 2. Création des utilisateurs
        const john = await User.create({
            nickname: "JohnDoe",
            email: "john.doe@example.com",
            password: "hashedpassword1",
            picture_url: null,
            description: null,
            token: null,
            email_verified: true,
            id_role: adminRole.id_role,
        });

        const jane = await User.create({
            nickname: "JaneSmith",
            email: "jane.smith@example.com",
            password: "hashedpassword2",
            picture_url: null,
            description: "J'aime la cuisine et les films",
            token: null,
            email_verified: false,
            id_role: userRole.id_role,
        });

        // 3. Création des films
        const inception = await Movie.create({
            title: "Inception",
        });
        const lotr = await Movie.create({
            title: "Le Seigneur des Anneaux",
        });

        // 4. Création des catégories
        const entree = await Category.create({ name: "Entrée" });
        const plat = await Category.create({ name: "Plat" });
        const dessert = await Category.create({ name: "Dessert" });

        // 5. Création des recettes
        const tarteCitron = await Recipe.create({
            name: "Tarte au citron",
            instructions: "Mélanger, cuire, déguster.",
            ingredients: "Citron, sucre, oeufs, pâte",
            image: null,
            id_user: john.id_user,
            id_movie: inception.id_movie,
        });
        const pizza = await Recipe.create({
            name: "Pizza maison",
            instructions: "Préparer la pâte, garnir, cuire.",
            ingredients: "Farine, eau, levure, tomate, fromage",
            image: null,
            id_user: jane.id_user,
            id_movie: lotr.id_movie,
        });

        // 6. Table de liaison RECIPE_CATEGORY
        await RecipeCategory.create({
            id_recipe: tarteCitron.id_recipe,
            id_category: dessert.id_category,
        });
        await RecipeCategory.create({
            id_recipe: pizza.id_recipe,
            id_category: plat.id_category,
        });

        console.log("Seed terminé !");
    } catch (error) {
        console.error("Erreur lors du seed :", error);
    } finally {
        await sequelize.close();
    }
}

seedTables();
