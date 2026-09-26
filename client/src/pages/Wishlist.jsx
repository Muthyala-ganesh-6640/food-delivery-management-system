import React, { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import { addToCart } from '../services/cartService';
import { setCart } from '../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import API from '../services/api';

const Wishlist = () => {
  const dispatch = useDispatch();

  const [wishlist, setWishlist] = useState({ foods: [], restaurants: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await API.get('/wishlist');
      if (res.data) setWishlist(res.data);
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (foodId) => {
    try {
      const res = await API.post(`/wishlist/food/${foodId}`);
      if (res.data) setWishlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (food) => {
    try {
      const res = await addToCart({ foodId: food._id, quantity: 1 });
      if (res.data) dispatch(setCart(res.data));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading your wishlist..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Your Saved Favorites</h1>
        <p className="text-xs text-slate-500">Quickly re-order the dishes you love</p>
      </div>

      {wishlist.foods.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <p className="text-3xl mb-2">❤️</p>
          <h3 className="font-bold text-slate-800 text-sm">Your wishlist is empty</h3>
          <p className="text-xs text-slate-400 mt-1">Click the heart icon on any food dish to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
