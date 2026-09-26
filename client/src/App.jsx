import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Search from './pages/Search';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Restaurant Owner Module
import RestaurantDashboard from './restaurant/RestaurantDashboard';
import RestaurantProfile from './restaurant/RestaurantProfile';
import MenuManagement from './restaurant/MenuManagement';
import RestaurantOrders from './restaurant/RestaurantOrders';
import Analytics from './restaurant/Analytics';
import Reviews from './restaurant/Reviews';

// Delivery Partner Module
import DeliveryDashboard from './delivery/DeliveryDashboard';
import AvailableOrders from './delivery/AvailableOrders';
import ActiveDelivery from './delivery/ActiveDelivery';
import DeliveryHistory from './delivery/DeliveryHistory';
import Earnings from './delivery/Earnings';

// Admin Module
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/Users';
import AdminRestaurants from './admin/Restaurants';
import AdminFoods from './admin/Foods';
import AdminOrders from './admin/Orders';
import AdminDeliveryPartners from './admin/DeliveryPartners';
import AdminCoupons from './admin/Coupons';
import AdminReports from './admin/Reports';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'RESTAURANT', 'DELIVERY', 'ADMIN']} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/orders/:id" element={<OrderTracking />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/addresses" element={<Addresses />} />
            </Route>

            {/* Restaurant Owner Routes */}
            <Route element={<ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']} />}>
              <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
              <Route path="/restaurant/profile" element={<RestaurantProfile />} />
              <Route path="/restaurant/menu" element={<MenuManagement />} />
              <Route path="/restaurant/orders" element={<RestaurantOrders />} />
              <Route path="/restaurant/analytics" element={<Analytics />} />
              <Route path="/restaurant/reviews" element={<Reviews />} />
            </Route>

            {/* Delivery Partner Routes */}
            <Route element={<ProtectedRoute allowedRoles={['DELIVERY', 'ADMIN']} />}>
              <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
              <Route path="/delivery/available" element={<AvailableOrders />} />
              <Route path="/delivery/active" element={<ActiveDelivery />} />
              <Route path="/delivery/history" element={<DeliveryHistory />} />
              <Route path="/delivery/earnings" element={<Earnings />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/restaurants" element={<AdminRestaurants />} />
              <Route path="/admin/foods" element={<AdminFoods />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/delivery-partners" element={<AdminDeliveryPartners />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
