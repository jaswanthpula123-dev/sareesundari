const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: [true, 'Please enter a review headline'],
      trim: true
    },
    comment: {
      type: String,
      required: [true, 'Please enter your review comments'],
      trim: true
    },
    verifiedPurchase: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from submitting multiple reviews on the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
