import { sequelize } from "../models/index.js"

console.log("🗑️ Suppression des tables existantes...");
await sequelize.drop({ cascade: true});

console.log("🚧 Définition des tables...");
await sequelize.sync();

console.log("🗃️ Structure de la base de données : ", await sequelize.getQueryInterface().showAllTables());

console.log("✅ Migration OK ! Fermeture de la base...");
await sequelize.close();
