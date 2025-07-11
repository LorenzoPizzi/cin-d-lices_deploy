import {
    sequelize,
    User,
    Role,
    Movie,
    Recipe,
    Category,
    RecipeCategory,
} from "../models/index.js";
import { scrypt } from "../utils/scrypt.js";

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
        const adminPassword = "adminpassword";
        const adminHashedPassword = scrypt.hash(adminPassword);
        const john = await User.create({
            nickname: "JohnDoe",
            email: "john.doe@example.com",
            password: adminHashedPassword,
            picture_url:
                "https://i.pinimg.com/originals/54/72/d1/5472d1b09d3d724228109d381d617326.jpg",
            description: "test",
            token: null,
            email_verified: true,
            id_role: adminRole.id_role,
        });
        const userPassword = "userpassword";
        const userHashedPassword = scrypt.hash(userPassword);
        const jane = await User.create({
            nickname: "JaneSmith",
            email: "jane.smith@example.com",
            password: userHashedPassword,
            picture_url: null,
            description: "J'aime la cuisine et les films",
            token: null,
            email_verified: true,
            id_role: userRole.id_role,
        });

        // 3. Création des films
        const inception = await Movie.create({
            title: "Inception",
            tmdb_id: 27205,
        });
        const lotr = await Movie.create({
            title: "Le Seigneur des Anneaux",
            tmdb_id: 120,
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
            image_url:
                "https://assets.afcdn.com/recipe/20200219/107873_w1024h768c1cx2120cy2110cxt0cyt0cxb4413cyb4404.jpg",
            id_user: john.id_user,
            id_movie: inception.id_movie,
        });
        const pizza = await Recipe.create({
            name: "Pizza maison",
            instructions: "Préparer la pâte, garnir, cuire.",
            ingredients: "Farine, eau, levure, tomate, fromage",
            image_url:
                "https://images.ctfassets.net/1p5r6txvlxu4/3LRdtPLHOQQJite2lWU6MR/534ee0cc061d9e04239136a7fc39d7f0/pizza_maison.jpg?w=768&h=541&fm=webp&q=100&fit=fill&f=center",
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
