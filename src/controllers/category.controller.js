import Category from "../models/category.model.js";

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        } catch (error) {
            console.error("Erreur getAllCategories:", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    createCategory: async (req, res) => {
        try {
            let { name } = req.body;
            if (!name)
                return res.status(400).json({ message: "Le nom est requis" });
            nameLower = name.toLowerCase();
            const nameExisting = await Category.findOne({
                where: { name: nameLower },
            });
            if (nameExisting) {
                return res
                    .status(409)
                    .json({ message: "Catégorie déjà existante" });
            }
            const newCategory = await Category.create({ nameLower });
            res.status(201).json(newCategory);
        } catch (error) {
            console.error("Erreur createCategory:", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const category = await Category.findByPk(id);
            if (!category)
                return res
                    .status(404)
                    .json({ message: "Catégorie non trouvée" });
            if (name) {
                name = name.toLowerCase();
                category.name = name;
            }

            await category.save();
            res.status(200).json(category);
        } catch (error) {
            console.error("Erreur updateCategory:", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            if (!category) return res.status(404).send("Catégorie non trouvée");

            await category.destroy();
            res.redirect("/admin");
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur serveur");
        }
    },
};

export default categoryController;
