import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Star, Flame, Sparkles, ShieldCheck, Clock, Award, PhoneCall } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';
import { CardSkeleton } from '../components/Loader';
import { addToCart } from '../services/cartService';
import { setCart } from '../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import API from '../services/api';

const categories = [
  { name: 'Biryani', icon: '🍲', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },
  { name: 'Burger', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
  { name: 'North Indian', icon: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80' },
  { name: 'South Indian', icon: '🥟', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chinese', icon: '🥢', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80' },
  { name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
  { name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80' },
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restRes, foodRes] = await Promise.all([
          API.get('/restaurants?limit=6'),
          API.get('/foods?limit=8'),
        ]);
        if (restRes.data) setRestaurants(restRes.data);
        if (foodRes.data) setFoods(foodRes.data);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (food) => {
    try {
      const res = await addToCart({ foodId: food._id, quantity: 1 });
      if (res.data) dispatch(setCart(res.data));
    } catch (err) {
      alert(err.message || 'Please log in to add items to your cart.');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-brand-dark text-white pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF5200_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-300 border border-white/10">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span>Fastest Food Delivery in Town</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Delicious Food, <br />
                <span className="text-transparent bg-clip-text gradient-brand">Delivered Fast.</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Order hot & fresh food from top-rated restaurants near you. Live order tracking, lightning fast doorstep delivery & instant online payment.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-auto flex-1 text-slate-800">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search restaurant or food item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm font-medium focus:outline-none placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <h4 className="text-xl font-extrabold text-white">500+</h4>
                  <p className="text-xs text-slate-400">Restaurants</p>
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-white">30 Min</h4>
                  <p className="text-xs text-slate-400">Avg Delivery Time</p>
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-white">4.8 ★</h4>
                  <p className="text-xs text-slate-400">Customer Rating</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                  alt="Delicious food spread"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 text-slate-800">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Delivery Time</p>
                    <p className="text-sm font-extrabold text-slate-900">25 - 30 Minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Popular Categories</h2>
            <p className="text-xs text-slate-500">Explore meals by your favorite cuisine</p>
          </div>
          <Link to="/categories" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/restaurants?cuisine=${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-xs hover:shadow-md hover:border-rose-200 transition-all group flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 overflow-hidden mb-3 group-hover:scale-110 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-brand-orange transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl gradient-brand p-8 sm:p-12 text-white overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg z-10">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              Exclusive Coupon Code: WELCOME50
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Get 50% OFF On Your First Order!
            </h2>
            <p className="text-rose-100 text-xs sm:text-sm font-medium">
              Order your favorite biryani, pizza or burgers today and save up to ₹150. Valid on orders above ₹199.
            </p>
            <Link
              to="/offers"
              className="inline-block bg-white text-brand-orange font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
            >
              Claim Offer Now
            </Link>
          </div>
          <div className="relative w-full max-w-xs h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <img
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
              alt="Special biryani offer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Top Rated Restaurants</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </h2>
            <p className="text-xs text-slate-500">Handpicked partners with highest ratings & superfast delivery</p>
          </div>
          <Link to="/restaurants" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended Food Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Popular Dishes</span>
              <Flame className="w-5 h-5 text-brand-orange" />
            </h2>
            <p className="text-xs text-slate-500">Most ordered meals across your city today</p>
          </div>
          <Link to="/restaurants" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">How FoodExpress Works</h2>
          <p className="text-xs text-slate-500 mb-12">4 simple steps to satisfy your food cravings</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-brand-orange flex items-center justify-center font-black text-xl mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">Select Restaurant</h3>
              <p className="text-xs text-slate-500">Browse hundreds of verified menus & top dishes.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-brand-orange flex items-center justify-center font-black text-xl mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">Place Your Order</h3>
              <p className="text-xs text-slate-500">Pay securely via Razorpay or Cash on Delivery.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-brand-orange flex items-center justify-center font-black text-xl mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">Real-Time Tracking</h3>
              <p className="text-xs text-slate-500">Watch your rider on map with live status updates.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-brand-orange flex items-center justify-center font-black text-xl mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">Enjoy Your Food</h3>
              <p className="text-xs text-slate-500">Hot food delivered right to your doorstep!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
