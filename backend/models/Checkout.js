// C:\rabbit\backend\models\Checkout.js

const mongoose = require('mongoose'); //

// Schema for each product item included in the checkout
const checkoutItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId, //
      ref: 'Product', // References the Product model
      required: true, //
    },
    name: {
      type: String, //
      required: true, //
    },
    image: {
      type: String, //
      required: true, //
    },
    price: {
      type: Number, //
      required: true, //
    },
    size: { type: String },
    color: { type: String },
    quantity: { type: Number, required: true, default: 1 },
  },
  {
    // Do not include an automatic _id field for sub-documents
    _id: false,
  }
);

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //
      ref: 'User', // References the User model
      required: true, //
    },
    checkoutItems: [checkoutItemSchema], // Array of purchased items using the sub-schema
    shippingAddress: {
      address: {
        type: String, //
        required: true, //
      },
      postalCode: {
        type: String, //
        required: true, //
      },
      city: { type: String, required: true, default: "Unknown" },
      country: {
        type: String, //
        required: true, //
      },
    },
    paymentMethod: {
      type: String, //
      required: true, //
    },
    totalPrice: {
      type: Number, //
      required: true, //
    },
    isPaid: {
      type: Boolean, //
      default: false, //
    },
    paidAt: {
      type: Date, //
    },
    paymentStatus: {
      type: String, //
      default: 'pending', //
    },
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed, // Stores various payment-related details (e.g., transaction ID, PayPal response)
    },
    isFinalized: {
      type: Boolean, //
      default: false, //
    },
    finalizedAt: {
      type: Date, //
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// 3. Export the Model
module.exports = mongoose.model("Checkout", checkoutSchema); //
