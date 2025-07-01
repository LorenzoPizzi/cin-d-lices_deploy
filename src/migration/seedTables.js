import { sequelize, User, Role, Movie, Recipe, Category, RecipeCategory } from "../models/index.js";

async function seedTables() {
  try {
    const now = new Date();

    // 1. Création des rôles
    const adminRole = await Role.create({ name: "admin", created_at: now, updated_at: now });
    const userRole = await Role.create({ name: "user", created_at: now, updated_at: now });

    // 2. Création des utilisateurs
    const john = await User.create({
      last_name: "Doe",
      first_name: "John",
      email: "john.doe@example.com",
      password: "hashedpassword1",
      pictures: null,
      id_role: adminRole.id_role,
      created_at: now,
      updated_at: now,
    });
    const jane = await User.create({
      last_name: "Smith",
      first_name: "Jane",
      email: "jane.smith@example.com",
      password: "hashedpassword2",
      pictures: null,
      id_role: userRole.id_role,
      created_at: now,
      updated_at: now,
    });

    // 3. Création des films
    const inception = await Movie.create({ title: "Inception", created_at: now, updated_at: now });
    const lotr = await Movie.create({ title: "Le Seigneur des Anneaux", created_at: now, updated_at: now });

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
      created_at: now,
      updated_at: now,
    });
    const pizza = await Recipe.create({
      name: "Pizza maison",
      instructions: "Préparer la pâte, garnir, cuire.",
      ingredients: "Farine, eau, levure, tomate, fromage",
      image: null,
      id_user: jane.id_user,
      id_movie: lotr.id_movie,
      created_at: now,
      updated_at: now,
    });

    // 6. Table de liaison RECIPE_CATEGORY
    await RecipeCategory.create({ id_recipe: tarteCitron.id_recipe, id_category: dessert.id_category });
    await RecipeCategory.create({ id_recipe: pizza.id_recipe, id_category: plat.id_category });

    console.log("Seed terminé !");
  } catch (error) {
    console.error("Erreur lors du seed :", error);
  } finally {
    await sequelize.close();
  }
}

seedTables();
