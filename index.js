import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("✅ Connexion à la base de données réussie !");
} catch (error) {
  console.error("❌ Impossible de se connecter à la base de données :", error);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("registerpage");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
