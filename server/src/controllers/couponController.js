const Coupon = require('../models/Coupon');

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
const getCoupons = async (req, res) => {
  const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } });
  res.json({ success: true, count: coupons.length, data: coupons });
};

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private (ADMIN)
const createCoupon = async (req, res) => {
  const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Coupon code already exists' });
  }

  const coupon = await Coupon.create({
    ...req.body,
    code: req.body.code.toUpperCase(),
  });

  res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private (ADMIN)
const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  Object.assign(coupon, req.body);
  await coupon.save();

  res.json({ success: true, message: 'Coupon updated', data: coupon });
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (ADMIN)
const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  await coupon.deleteOne();
  res.json({ success: true, message: 'Coupon deleted' });
};

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  const { code, amount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  }

  if (new Date() > new Date(coupon.expiryDate)) {
    return res.status(400).json({ success: false, message: 'Coupon has expired' });
  }

  if (amount < coupon.minOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
    });
  }

  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = Math.min((amount * coupon.discountAmount) / 100, coupon.maxDiscount || 500);
  } else {
    discount = coupon.discountAmount;
  }

  res.json({
    success: true,
    message: 'Coupon applied successfully',
    data: {
      code: coupon.code,
      discount,
      coupon,
    },
  });
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
