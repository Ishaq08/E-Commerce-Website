const mongoose = require('mongoose'); //

// --- 1. Define Cart Item Schema (for products within the cart) ---
const cartItemSchema = new mongoose.Schema(
  {
    //
    // Reference to the actual Product document
    productId: {
      //
      type: mongoose.Schema.Types.ObjectId, //
      ref: 'Product', //
      required: true, //
    },
    // Denormalized product details (useful for snapshotting the price/name at the time of addition)
    name: String, //
    image: String, //
    price: Number, //
    size: String, //
    color: String, //

    // Quantity and its default
    quantity: {
      //
      type: Number, //
      default: 1, //
    },
  },
  {
    // Options for the inner schema: Do not create an _id field for cart items
    _id: false, //
  }
);

// --- 2. Define Main Cart Schema ---
const cartSchema = new mongoose.Schema(
  {
    //
    // Reference to the logged-in User
    user: {
      //
      type: mongoose.Schema.Types.ObjectId, //
      ref: 'User', //
      required: false, // Inferred: Not required since guestId exists
    },
    // Unique ID for a guest user's cart
    guestId: {
      //
      type: String, //.jpg)
      required: false, // Inferred: Not required since user exists
    },
    // Array of cart items using the schema defined above
    products: [cartItemSchema], //.jpg)

    // Total calculated price of all items in the cart
    totalPrice: {
      //.jpg)
      type: Number, //.jpg)
      required: true, //.jpg)
      default: 0, //.jpg)
    },
  },
  {
    // Schema options: Automatically add createdAt and updatedAt fields
    timestamps: true, //
  }
);

// --- 3. Export the Model ---
module.exports = mongoose.model('Cart', cartSchema); //
