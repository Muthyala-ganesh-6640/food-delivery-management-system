import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  MapPin,
  Bell,
  LogOut,
  ChevronDown,
  Heart,
  LayoutDashboard,
  UtensilsCrossed,
  Bike,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { setNotifications } from '../redux/slices/notificationSlice';
import API from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items, total } = useSelector((state) => state.cart);
  const { unreadCount } = useSelector((state) => state.notification);

  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    if (isAuthenticated) {
      API.get('/notifications')
        .then((res) => {
          if (res.data) dispatch(setNotifications(res));
        })
        .catch(() => {});
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-brand-orange transition-colors">
                  Food<span className="text-brand-orange">Express</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  Delivery System
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              placeholder="Search for restaurants, biryani, pizza, burgers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-brand-orange rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-3">
            {/* User Role Quick Link Badge */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'RESTAURANT' && (
              <Link
                to="/restaurant/dashboard"
                className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Partner Portal</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'DELIVERY' && (
              <Link
                to="/delivery/dashboard"
                className="hidden sm:flex items-center gap-1.5 bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-cyan-100 transition-colors"
              >
                <Bike className="w-4 h-4" />
                <span>Rider Hub</span>
              </Link>
            )}

            {/* Notifications Button */}
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors hidden sm:block"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-brand-orange" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {total > 0 && <span className="text-slate-400 font-normal">| ₹{total}</span>}
            </Link>

            {/* User Profile Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-200"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-rose-50 text-brand-orange">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/order-history"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      <span>Order History</span>
                    </Link>

                    <Link
                      to="/addresses"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Saved Addresses</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'RESTAURANT' && (
                      <Link
                        to="/restaurant/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                      >
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Restaurant Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'DELIVERY' && (
                      <Link
                        to="/delivery/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                      >
                        <Bike className="w-4 h-4" />
                        <span>Delivery Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-brand-orange px-3 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base">Select Your City</h3>
              <button onClick={() => setShowLocationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['New Delhi', 'Gurugram', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Kolkata'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowLocationModal(false);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    selectedCity === city
                      ? 'border-brand-orange bg-rose-50 text-brand-orange'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
