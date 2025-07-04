import Category from '../models/category.model.js';

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Erreur getAllCategories:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Le nom est requis' });

      const newCategory = await Category.create({ name });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Erreur createCategory:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });

      category.name = name || category.name;
      await category.save();
      res.status(200).json(category);
    } catch (error) {
      console.error('Erreur updateCategory:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });

      await category.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Erreur deleteCategory:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

export default categoryController;
