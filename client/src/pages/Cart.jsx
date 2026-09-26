import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, ArrowRight, Trash2, Tag, Check, Sparkles } from 'lucide-react';
import CartItem from '../components/CartItem';
import Button from '../components/Button';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService';
import { setCart, clearCartState, applyCouponState, removeCouponState } from '../redux/slices/cartSlice';
import API from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, restaurant, subtotal, deliveryFee, tax, discount, coupon, total } = useSelector(
    (state) => state.cart
  );

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      if (res.data) {
        dispatch(setCart(res.data));
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const res = await updateCartItem(itemId, { quantity: newQuantity });
      if (res.data) dispatch(setCart(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await removeCartItem(itemId);
      if (res.data) dispatch(setCart(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      dispatch(clearCartState());
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await API.post('/coupons/validate', {
        code: couponInput,
        amount: subtotal,
      });

      if (res.data) {
        dispatch(applyCouponState({ code: res.data.code, discount: res.data.discount }));
        setCouponSuccess(`Coupon ${res.data.code} applied! Saved ₹${res.data.discount}`);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCouponState());
    setCouponInput('');
    setCouponSuccess('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          🛒
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Looks like you haven't added any delicious food items to your cart yet.
        </p>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md"
        >
          <span>Explore Restaurants</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500">Order from {restaurant?.name || 'Partner Kitchen'}</p>
        </div>
        <button
          onClick={handleClearCart}
          className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="space-y-6">
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-orange" />
              <span>Apply Promo Code</span>
            </h3>

            {coupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div>
                  <span className="text-xs font-black text-emerald-800 block">CODE: {coupon}</span>
                  <span className="text-[11px] text-emerald-600">Saved ₹{discount} on this order</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code e.g. WELCOME50"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-orange"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && <p className="text-[11px] font-semibold text-rose-600">{couponError}</p>}
            {couponSuccess && <p className="text-[11px] font-semibold text-emerald-600">{couponSuccess}</p>}
          </div>

          {/* Bill Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm pb-3 border-b border-slate-100">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="font-bold text-slate-900">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">₹{deliveryFee}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Applied</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-slate-100 text-base font-extrabold text-slate-900">
                <span>Grand Total</span>
                <span className="text-brand-orange">₹{total}</span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={() => navigate('/checkout')}
              className="mt-4"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
