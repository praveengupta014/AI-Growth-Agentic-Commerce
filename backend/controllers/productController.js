const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin endpoint to add real products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
