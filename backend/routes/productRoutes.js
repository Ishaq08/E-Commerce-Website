const express = require('express');
const Product = require('../models/Product.js');
const { protect, admin } = require('../middelware/authMiddleware.js');

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new Product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    // 1. Extract product details from the request body
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    // 2. Create a new Product instance
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      // Reference to the admin user who created it (from the 'protect' middleware)
      user: req.user._id,
    });

    // 3. Save the product to the database
    const createdProduct = await product.save();

    // 4. Send success response
     res.status(201).json(createdProduct);
  } catch (error) {
    // 5. Handle errors
    console.error(error);
    res.status(500).send('Server Error'); // Or .json({ message: "Server Error" })
  }
});

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get('/', async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      search,
      category,
      material,
      brand,
        limit,
      sortBy
    } = req.query; // = req.query; is split across lines

    let query = {}; // Initialize the Mongoose query object (Line 172)

    // --- FILTERING LOGIC --- //

    // 1. Collection Filter (Line 175-178)
    if (collection && collection.toLowerCase() !== 'all') {
      query.collections = collection;
    }

    // 2. Category Filter (Line 180-182)
    if (category && category.toLowerCase() !== 'all') {
      query.category = category;
    }

    // 3. Material Filter (Line 183-185)
    // Splits a comma-separated string into an array for $in operation
    if (material) {
      query.material = { $in: material.split(',') };
    }

    // 4. Brand Filter (Line 187-190)
    // Splits a comma-separated string into an array for $in operation
    if (brand) {
      query.brand = { $in: brand.split(',') };
    }

    // 5. Size Filter (Line 191-194)
    // Splits a comma-separated string into an array for $in operation
    if (size) {
      query.sizes = { $in: size.split(',') };
    }

    // 6. Color Filter (Line 195-198)
    // Assumes color is passed as a string/array that needs no splitting
    if (color) {
      query.colors = { $in: [color] }; // Note: Screenshot shows `[color]`, likely to handle single value or array
    }

    // 7. Gender Filter (Line 199-202)
    if (gender) {
      query.gender = gender;
    }

    // 8. Price Range Filter (Line 203-207)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice); // $gte for greater than or equal
      if (maxPrice) query.price.$lte = Number(maxPrice); // $lte for less than or equal
    }

    // 9. Search (Text Search) Filter (Line 209-214)
    if (search) {
      // Uses $or to search across 'name' OR 'description' fields
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
        { description: { $regex: search, $options: 'i' } },
      ];
      }
      
    let sort = {};
    if (sortBy) {
      //
      switch (
        sortBy //
      ) {
        case 'priceAsc': //
          sort = { price: 1 }; // (1 for ascending)
          break; //
        case 'priceDesc': //
          sort = { price: -1 }; // (-1 for descending)
          break; //
        case 'popularity': //
          sort = { rating: -1 }; // (Popularity often means highest rating first)
          break;
        default:
          break;
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit || 0));
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/products/best-seller
// @desc Retrieve the product with highest rating (or the top best-selling products)
// @access Public
router.get("/best-seller", async (req, res) => {
    try {
        // Find all products, sort by 'rating' descending (-1), and limit to 10 (or a number of your choice)
        const bestSeller = await Product.find({})
            .sort({ rating: -1 }) 
            .limit(10); // Limit added for demonstration

        if (bestSeller.length === 0) {
            // If no products are found, return the 404 response and exit.
            return res.status(404).json({ message: "No best sellers found" });
        } 
        
        // If products are found, send the successful 200 response and exit.
        return res.json(bestSeller); // FIX: Added 'return' and used res.json (defaults to 200 OK)

    } catch (error) {
        console.error(error);
        // FIX: Ensure the catch block also uses 'return'
        return res.status(500).send("Server Error");
    }
});

// @route GET /api/products/new-arrivals
// @desc Retrieve latest 8 products - Creation date
// @access Public
router.get("/new-arrivals", async (req, res) => { //
    try { //
        // Fetch latest 8 products
        const newArrivals = await Product.find({}) //
            .sort({ createdAt: -1 }) // Sort by creation date descending (-1)
            .limit(8); // Limit to 8 products

        // Send successful response
        return res.json(newArrivals); // Added 'return' for robustness and success response

    } catch (error) { //
        console.error(error); //
        
        // Send error response
        return res.status(500).send("Server Error"); // Added 'return' for robustness
    }
});

// @route GET /api/products/similar/:id
// @desc Retrieve similar products based on the current product's gender and category
// @access Public
router.get("/similar/:id", async (req, res) => { //
    try {
        const { id } = req.params; // Destructure the product ID from request parameters

        // 1. Find the current product to get its gender and category
        const currentProduct = await Product.findById(id);

        if (!currentProduct) {
            return res.status(404).json({ message: "Base Product Not Found" });
        }

        // 2. Define the similarity criteria
        const { gender, category } = currentProduct;

        // 3. Build the query to find similar products
        const similarProducts = await Product.find({
            // Match products that have the same gender OR the same category
            $or: [
                { gender: gender },
                { category: category },
            ],
            // Exclude the current product itself
            _id: { $ne: id },
            // Limit the number of similar products returned
        }).limit(5); // Commonly used limit for similar items

        // 4. Send the response
        res.json(similarProducts);

    } catch (error) {
        // Error Handling
        console.error(error);
        res.status(500).send("Server Error");
    }
});



// Lines 130-133: Route comments
// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove the product from DB
      await product.deleteOne(); // Mongoose method to delete the document
      res.json({ message: 'Product removed' });
    } else {
      // Product not found
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    // Error Handling
    console.error(error);
    res.status(500).send('Server Error');
  }
});


// --- GET Route: Fetch a single product by ID (Public) ---
// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async (req, res) => { //
    try {
        const product = await Product.findById(req.params.id); //

        if (product) { //
            res.json(product); //
        } else {
            res.status(404).json({ message: "Product Not Found" }); //
        }
    } catch (error) { //
        console.error(error); //
        res.status(500).send("Server Error"); //
    }
});
// @route PUT /api/products/:id
// @desc Update an existing product ID
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    // 1. Destructure product fields from the request body
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    // 2. Find the product by its ID
    const product = await Product.findById(req.params.id);

    // 3. Check if the product exists
    if (product) {
      // Update product fields using the '||' operator.
      // This means if a new value (e.g., 'name') is provided in the request body,
      // use it; otherwise, keep the existing value (e.g., 'product.name').

      // Update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender; // Note: Screenshot 314 shows an incomplete line here, this is the intended final line.
      product.images = images || product.images;

      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;

      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      // Save the updated product
      const updatedProduct = await product.save();
      res.json(updatedProduct); // Send the updated product as JSON
    } else {
      // Product not found
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    // 4. Error Handling
    console.error(error);
    res.status(500).send('Server Error'); // Send a generic 500 error response
  }
});




module.exports = router;
