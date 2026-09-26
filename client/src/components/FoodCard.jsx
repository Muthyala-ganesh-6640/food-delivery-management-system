import React from 'react';
import { Plus, Heart, Clock, Star } from 'lucide-react';

const FoodCard = ({ food, onAddToCart, onToggleWishlist, isWishlisted = false }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 rounded-md shadow-sm border border-slate-100 flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          ></span>
          <span className="text-[11px] font-semibold text-slate-700">
            {food.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        {/* Discount Badge */}
        {food.discount > 0 && (
          <div className="absolute top-3 right-12 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md">
            {food.discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist && onToggleWishlist(food._id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur text-slate-600 hover:text-rose-500 hover:bg-white shadow-sm transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-brand-orange transition-colors">
              {food.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{food.rating || 4.5}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {food.description || 'Delicious freshly prepared dish with premium ingredients.'}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {food.preparationTime || '15-20 min'}
            </span>
            <span>•</span>
            <span className="text-slate-600 font-medium">{food.category}</span>
          </div>
        </div>

        {/* Pricing & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{food.finalPrice || food.price}
              </span>
              {food.discount > 0 && (
                <span className="text-xs text-slate-400 line-through">₹{food.price}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart(food)}
            className="flex items-center gap-1 bg-rose-50 hover:bg-brand-orange text-brand-orange hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border border-rose-200 hover:border-brand-orange shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
