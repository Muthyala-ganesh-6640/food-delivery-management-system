const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

// @desc    Add review for restaurant / food / delivery
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  const { restaurantId, foodId, deliveryPartnerId, orderId, rating, comment } = req.body;

  const review = await Review.create({
    user: req.user._id,
    restaurant: restaurantId,
    food: foodId,
    deliveryPartner: deliveryPartnerId,
    order: orderId,
    rating: Number(rating),
    comment: comment || '',
  });

  // Recalculate restaurant average rating
  const reviews = await Review.find({ restaurant: restaurantId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: Number(avgRating.toFixed(1)),
    numReviews: reviews.length,
  });

  if (foodId) {
    const foodReviews = await Review.find({ food: foodId });
    const foodAvg = foodReviews.reduce((acc, item) => item.rating + acc, 0) / foodReviews.length;
    await Food.findByIdAndUpdate(foodId, {
      rating: Number(foodAvg.toFixed(1)),
      numReviews: foodReviews.length,
    });
  }

  res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/:restaurantId
// @access  Public
const getRestaurantReviews = async (req, res) => {
  const reviews = await Review.find({ restaurant: req.params.restaurantId })
    .populate('user', 'name profileImage')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reviews.length, data: reviews });
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner / ADMIN)
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
};

module.exports = {
  createReview,
  getRestaurantReviews,
  deleteReview,
};
