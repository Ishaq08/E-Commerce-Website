const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    sizes: {
      type: [String],
      required: true, // e.g. ['S', 'M', 'L']
    },

    colors: {
      type: [String],
      required: true, // e.g. ['Red', 'Blue']
    },

    collections: {
      type: [String],
      required: true, // e.g. 'SummerCollection'
      trim: true,
    },

    material: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
    },

    images: {
      type: [imageSchema],
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviwes: {
      type: Number,
      default: 0,
        },
        tags: {
            type: [String]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
           required: true
        },
        metaTitle: {
            type: String
        },
        metaDescription: {
            type: String
        },
        metaKeywords: {
            type: String
        },
        dimensions: {
            lenght: Number,
            width: Number,
            height: Number,
        },
        weight: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
