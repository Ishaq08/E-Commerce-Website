// Load dependencies and files
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // Line 3: Requires the Product model
const User = require('./models/User'); // Line 4: Requires the User model
const Cart = require('./models/Cart'); // Line 4: Requires the User model
const products = require('./data/products'); // Line 5: Requires the sample product data array

dotenv.config(); // Line 7: Loads environment variables

// Connect to MongoDB
// Line 10: Connect to mongoDB
mongoose.connect(process.env.MONGODB_URI);

// Function to seed data
const seedData = async () => {
  // Line 14: Define the async seedData function
  try {
    // Clear existing data (Line 16-18)
    await Product.deleteMany(); // Clear all existing products
    await User.deleteMany(); // Clear all existing users
    await Cart.deleteMany(); // Clear all existing users

    // Create the default admin user (Line 20-25)
    const createdUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
    });

    // Assign the default user ID to each product (Line 28-33)
    const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return {
        ...product, // Spread existing product properties
        user: userID, // Add the created Admin User's ID
      };
    });

    // Insert the products into the database (Line 35-36)
    // Insert the products into the database
    await Product.insertMany(sampleProducts);

    console.log('Product data seeded successfully!');
    process.exit(); // Exit the process successfully
  } catch (error) {
    // Line 40: Catch block for errors
    console.error('Error seeding the data:', error);
    process.exit(1); // Exit the process with an error code
  }
};

// Execute the function (Line 46)
seedData();
