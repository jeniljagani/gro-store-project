const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const pageSize = 50;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            name: { $regex: req.query.keyword, $options: 'i' }
        } : {};
        const category = req.query.category ? { category: req.query.category } : {};

        const query = { ...keyword, ...category };

        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
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

// @desc    Create a product (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    const { name, price, description, image, category, nutrition } = req.body;
    try {
        const product = new Product({
            name, price, description, image, category, nutrition, user: req.user._id
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Create new review
// @route   POST /api/products/:id/reviews
exports.createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);

            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
