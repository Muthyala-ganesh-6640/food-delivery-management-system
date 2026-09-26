import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
    >
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.banner || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Logo overlay */}
        <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-white p-1 shadow-md overflow-hidden border border-slate-100">
          <img
            src={restaurant.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'}
            alt={restaurant.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Closed Badge if offline */}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-md shadow">
              Currently Closed
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-brand-orange transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-xs font-bold shadow-xs">
              <Star className="w-3 h-3 fill-white text-white" />
              <span>{restaurant.rating || 4.5}</span>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-500 mb-2 truncate">
            {restaurant.cuisine?.join(', ') || 'Multi-cuisine'}
          </p>

          <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{restaurant.address?.area || restaurant.address?.city || 'City Center'}</span>
          </p>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{restaurant.deliveryTime || '25-35 min'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span>₹{restaurant.deliveryFee || 40} Fee</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
