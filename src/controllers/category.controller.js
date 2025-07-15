import Category from "../models/category.model.js";
import { StatusCodes } from "http-status-codes";

export async function getAllCategories(req, res) {
    try {
        const categories = await Category.findAll();
        res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        console.error("Erreur getAllCategories:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erreur serveur",
        });
    }
}

export async function createCategory(req, res) {
    try {
        let { name } = req.body;
        if (!name)
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Le nom est requis" });
        nameLower = name.toLowerCase();
        const nameExisting = await Category.findOne({
            where: { name: nameLower },
        });
        if (nameExisting) {
            return res
                .status(StatusCodes.CONFLICT)
                .json({ message: "Catégorie déjà existante" });
        }
        const newCategory = await Category.create({ nameLower });
        res.status(StatusCodes.CREATED).json(newCategory);
    } catch (error) {
        console.error("Erreur createCategory:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erreur serveur",
        });
    }
}

export async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByPk(id);
        if (!category)
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Catégorie non trouvée" });
        if (name) {
            name = name.toLowerCase();
            category.name = name;
        }

        await category.save();
        res.status(StatusCodes.OK).json(category);
    } catch (error) {
        console.error("Erreur updateCategory:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erreur serveur",
        });
    }
}

export async function deleteCategory(req, res) {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category)
            return res
                .status(StatusCodes.NOT_FOUND)
                .send("Catégorie non trouvée");

        await category.destroy();
        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Erreur serveur");
    }
}
