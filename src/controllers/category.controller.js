const { Category } = require('../models'); 

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur getAllCategories:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur getAllCategory:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByPk(id);
        if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
        category.name = name  || category.name;
        await category.save();

        res.status(200).json(category); 
    } catch (error) {
        console.error('Erreur updateCategory:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteCategory = async (req, res) => {
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
};

        