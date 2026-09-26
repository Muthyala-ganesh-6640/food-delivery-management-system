import React, { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';
import Loader from '../components/Loader';
import { addToCart } from '../services/cartService';
import { setCart } from '../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import API from '../services/api';

const OrderHistory = () => {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/orders');
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order) => {
    try {
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          if (item.food) {
            const res = await addToCart({ foodId: item.food, quantity: item.quantity });
            if (res.data) dispatch(setCart(res.data));
          }
        }
        alert('Items readded to cart!');
      }
    } catch (err) {
      alert('Reorder failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Your Order History</h1>
        <p className="text-xs text-slate-500">Track current orders or reorder your past favorites</p>
      </div>

      {loading ? (
        <Loader text="Loading your orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <p className="text-3xl mb-2">📜</p>
          <h3 className="font-bold text-slate-800 text-sm">No orders found</h3>
          <p className="text-xs text-slate-400 mt-1">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onReorder={handleReorder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
