// C:\rabbit\backend\models\Order.js

const mongoose = require('mongoose'); //

// Schema for each product item included in the order
const orderItemSchema = new mongoose.Schema(
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
    size: {
      type: String, //
    },
    color: {
      type: String, //
    },
    quantity: {
      type: Number, //
      required: true, //
    },
  },
  {
    // Do not include an automatic _id field for sub-documents
    _id: false,
  }
);
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //
      ref: "User", // References the User model
      required: true, //
    },
    orderItems: [orderItemSchema], // Array of purchased items using the sub-schema
    shippingAddress: {
      address: {
        type: String, //
        required: true, //
      },
      city: {
        type: String, //
        required: true, //
      },
      postalCode: {
        type: String, //
        required: true, //
      },
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
    isDelivered: {
      type: Boolean, //
      default: false, //
    },
    deliveredAt: {
      type: Date, //
    },
    paymentStatus: {
      type: String, //
      default: "pending", //
    },
    status: {
      type: String, //
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"], // Allowed order statuses
      default: "Processing", // Default status for a new order
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// 3. Export the Model
module.exports = mongoose.model("Order", orderSchema); //