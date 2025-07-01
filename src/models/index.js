import { sequelize } from "../index.js";

import User from "./user.model.js";
import Role from "./role.model.js";
import Movie from "./movie.model.js";
import Recipe from "./recipe.model.js";
import Category from "./category.model.js";
import RecipeCategory from "./recipe_category.model.js";

Role.hasMany(User, {
  as: "users",
  foreignKey: {
    name: "id_role",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
User.belongsTo(Role, {
  as: "role",
  foreignKey: "id_role",
});


User.hasMany(Recipe, {
  as: "recipes",
  foreignKey: {
    name: "id_user",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Recipe.belongsTo(User, {
  as: "author",
  foreignKey: "id_user",
});


Movie.hasMany(Recipe, {
  as: "recipes",
  foreignKey: {
    name: "id_movie",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Recipe.belongsTo(Movie, {
  as: "movie",
  foreignKey: "id_movie",
});


Recipe.belongsToMany(Category, {
  as: "categories",
  through: RecipeCategory,
  foreignKey: "id_recipe",
  otherKey: "id_category",
});
Category.belongsToMany(Recipe, {
  as: "recipes",
  through: RecipeCategory,
  foreignKey: "id_category",
  otherKey: "id_recipe",
});

export {
  sequelize,
  User,
  Role,
  Movie,
  Recipe,
  Category,
  RecipeCategory,
};
