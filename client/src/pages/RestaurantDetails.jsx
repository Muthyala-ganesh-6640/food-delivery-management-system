import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Bike, MapPin, Phone, Info, ChevronLeft } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import { addToCart } from '../services/cartService';
import { setCart } from '../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import API from '../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/restaurants/${id}`);
        if (res.data) {
          setRestaurant(res.data);
          const foodList = res.data.foods || [];
          setFoods(foodList);

          const cats = ['All', ...new Set(foodList.map((f) => f.category))];
          setCategories(cats);
        }
      } catch (err) {
        console.error('Fetch restaurant error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleAddToCart = async (food) => {
    try {
      const res = await addToCart({ foodId: food._id, quantity: 1 });
      if (res.data) dispatch(setCart(res.data));
    } catch (err) {
      alert(err.message || 'Please sign in to add items to cart');
    }
  };

  if (loading) return <Loader text="Loading restaurant menu..." />;
  if (!restaurant) return <div className="text-center py-20">Restaurant not found</div>;

  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchesVeg = vegOnly ? food.isVeg : true;
    return matchesCategory && matchesVeg;
  });

  return (
    <div className="pb-16 space-y-8">
      {/* Header Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
        <img
          src={restaurant.banner || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/restaurants"
            className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Restaurants</span>
          </Link>
        </div>

        {/* Floating Restaurant Details Card */}
        <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8 max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={restaurant.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'}
                alt={restaurant.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              <div>
                <h1 className="text-2xl font-black text-slate-900">{restaurant.name}</h1>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  {restaurant.cuisine?.join(', ')}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  <span>{restaurant.address?.street}, {restaurant.address?.city}</span>
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>{restaurant.rating || 4.5}</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Rating</span>
              </div>

              <div className="text-center">
                <span className="text-sm font-extrabold text-slate-900 block">{restaurant.deliveryTime}</span>
                <span className="text-[11px] text-slate-400">Delivery</span>
              </div>

              <div className="text-center">
                <span className="text-sm font-extrabold text-slate-900 block">₹{restaurant.deliveryFee}</span>
                <span className="text-[11px] text-slate-400">Fee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu & Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg Only Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-700">Veg Only</span>
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                vegOnly ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  vegOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
            <p className="text-3xl mb-2">🥗</p>
            <h3 className="text-base font-bold text-slate-800">No dishes in this category</h3>
            <p className="text-xs text-slate-400 mt-1">Try turning off the veg-only filter or select another menu category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food._id} food={food} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
