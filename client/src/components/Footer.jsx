import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Truck, Headphones } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800 mb-12">
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-rose-500/10 text-brand-orange rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Lightning Fast Delivery</h4>
              <p className="text-xs text-slate-400">Hot food delivered in under 30 minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-rose-500/10 text-brand-orange rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Hygiene Verified</h4>
              <p className="text-xs text-slate-400">100% safety & quality check passed</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-rose-500/10 text-brand-orange rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">24/7 Order Support</h4>
              <p className="text-xs text-slate-400">Instant assistance for all orders</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <span className="text-lg font-extrabold text-white">
                Food<span className="text-brand-orange">Express</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              FoodExpress is your premier online food ordering and real-time delivery platform bringing your favorite restaurant meals straight to your doorstep.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="text-xs font-semibold">Follow Us:</span>
              <div className="flex gap-2">
                {['Twitter', 'Instagram', 'Facebook'].map((item) => (
                  <span key={item} className="p-2 rounded-lg bg-slate-900 text-xs text-slate-300 hover:text-brand-orange hover:bg-slate-800 cursor-pointer transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/restaurants" className="hover:text-brand-orange transition-colors">Browse Restaurants</Link></li>
              <li><Link to="/categories" className="hover:text-brand-orange transition-colors">Food Categories</Link></li>
              <li><Link to="/offers" className="hover:text-brand-orange transition-colors">Latest Offers & Coupons</Link></li>
              <li><Link to="/search" className="hover:text-brand-orange transition-colors">Search Dishes</Link></li>
            </ul>
          </div>

          {/* User Roles Portal Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">For Partners & Roles</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/register?role=RESTAURANT" className="hover:text-brand-orange transition-colors">Add your Restaurant</Link></li>
              <li><Link to="/register?role=DELIVERY" className="hover:text-brand-orange transition-colors">Become a Delivery Partner</Link></li>
              <li><Link to="/login" className="hover:text-brand-orange transition-colors">Partner Portal Sign In</Link></li>
              <li><Link to="/login" className="hover:text-brand-orange transition-colors">Admin Portal Sign In</Link></li>
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Experience FoodExpress App</h4>
            <p className="text-xs text-slate-400 mb-4">Download our mobile app for exclusive deals and instant order tracking.</p>
            <div className="flex flex-col gap-2">
              <button className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <span>📱 Google Play Store</span>
              </button>
              <button className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <span>🍎 Apple App Store</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FoodExpress Delivery Management System. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>using MERN Stack & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
