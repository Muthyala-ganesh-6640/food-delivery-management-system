import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';
import Loader from '../components/Loader';
import { addToCart } from '../services/cartService';
import { setCart } from '../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import API from '../services/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const query = searchParams.get('q') || '';

  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const [foodRes, restRes] = await Promise.all([
        API.get(`/foods?search=${encodeURIComponent(query)}`),
        API.get(`/restaurants?search=${encodeURIComponent(query)}`),
      ]);

      if (foodRes.data) setFoods(foodRes.data);
      if (restRes.data) setRestaurants(restRes.data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Search Results for "{query}"
        </h1>
        <p className="text-xs text-slate-500">Matching restaurants and food items</p>
      </div>

      {loading ? (
        <Loader text="Searching FoodExpress network..." />
      ) : (
        <div className="space-y-12">
          {/* Restaurants Section */}
          {restaurants.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Restaurants ({restaurants.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((rest) => (
                  <RestaurantCard key={rest._id} restaurant={rest} />
                ))}
              </div>
            </div>
          )}

          {/* Foods Section */}
          {foods.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Dishes & Food Items ({foods.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {foods.map((food) => (
                  <FoodCard key={food._id} food={food} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </div>
          )}

          {restaurants.length === 0 && foods.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
              <p className="text-3xl mb-2">🔍</p>
              <h3 className="font-bold text-slate-800 text-sm">No results found for "{query}"</h3>
              <p className="text-xs text-slate-400 mt-1">Try searching for Biryani, Pizza, Burger, or a restaurant name.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
