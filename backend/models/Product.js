const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please enter product description']
    },
    category: {
      type: String,
      required: [true, 'Please specify saree weave category']
    },
    price: {
      type: Number,
      required: [true, 'Please enter base price'],
      min: [0, 'Price must be positive']
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price must be positive']
    },
    weightOptions: {
      type: [String],
      default: ['Standard Drape (6.3m)', 'With Unstitched Blouse', 'Custom Stitched Blouse']
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      default: 30,
      min: [0, 'Stock cannot be negative']
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Few Left', 'Out of Stock'],
      default: 'In Stock'
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image']
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isFestivalSpecial: {
      type: Boolean,
      default: false
    },
    isVeg: {
      type: Boolean,
      default: true
    },
    pureGhee: {
      type: Boolean,
      default: true
    },
    shelfLife: {
      type: String,
      default: 'Dry Clean Only'
    },
    ingredients: {
      type: String,
      default: '100% Pure Mulberry Silk, Tested 24K Gold Zari'
    }
  },
  {
    timestamps: true
  }
);

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for active price
productSchema.virtual('finalPrice').get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
