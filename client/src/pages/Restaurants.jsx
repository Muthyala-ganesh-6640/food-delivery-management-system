import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { CardSkeleton } from '../components/Loader';
import { Search, Filter, Star, Clock, ArrowUpDown } from 'lucide-react';
import API from '../services/api';

const cuisinesList = ['Biryani', 'Pizza', 'Burger', 'North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Desserts', 'Beverages'];

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (selectedCuisine) params.cuisine = selectedCuisine;
        if (selectedRating) params.rating = selectedRating;
        if (sortBy) params.sortBy = sortBy;

        const res = await API.get('/restaurants', { params });
        if (res.data) setRestaurants(res.data);
      } catch (err) {
        console.error('Restaurants fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [search, selectedCuisine, selectedRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Filter & Search Bar Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Explore Restaurants</h1>
            <p className="text-xs text-slate-500">Discover top-rated dining places & kitchens near you</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search restaurant or cuisine..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:border-brand-orange"
            >
              <option value="rating">Sort by Rating</option>
              <option value="deliveryTime">Fastest Delivery</option>
              <option value="minimumOrder">Min Order Price</option>
              <option value="newest">Newest Added</option>
            </select>
          </div>
        </div>

        {/* Cuisine Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCuisine('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCuisine === ''
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Cuisines
          </button>
          {cuisinesList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c === selectedCuisine ? '' : c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCuisine === c
                  ? 'bg-brand-orange text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <p className="text-4xl mb-3">🍽️</p>
          <h3 className="text-lg font-bold text-slate-800">No restaurants match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting a different cuisine.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <RestaurantCard key={rest._id} restaurant={rest} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
