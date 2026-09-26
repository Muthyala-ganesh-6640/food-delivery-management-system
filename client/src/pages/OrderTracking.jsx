import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Phone, Bike, Utensils, Star, ShieldCheck } from 'lucide-react';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import API from '../services/api';
import { socket, joinOrderRoom } from '../utils/socket';

const steps = [
  { status: 'PLACED', label: 'Order Placed', desc: 'Received by system' },
  { status: 'CONFIRMED', label: 'Restaurant Confirmed', desc: 'Order accepted' },
  { status: 'PREPARING', label: 'Preparing Food', desc: 'Kitchen is cooking' },
  { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Waiting for rider' },
  { status: 'PICKED_UP', label: 'Picked Up', desc: 'Rider collected food' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'On the way to you' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your meal!' },
];

const OrderTracking = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetchOrderDetails();

    // Connect to Socket room
    joinOrderRoom(id);

    socket.on('order_status_updated', (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.off('order_status_updated');
    };
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/${id}`);
      if (res.data) setOrder(res.data);
    } catch (err) {
      console.error('Fetch order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;

    try {
      await API.post('/reviews', {
        restaurantId: order.restaurant?._id,
        orderId: order._id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSubmitted(true);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    }
  };

  if (loading) return <Loader text="Fetching live order tracking status..." />;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const currentStepIndex = steps.findIndex((s) => s.status === order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Order Timeline • #{order.orderId}
          </span>
          <h1 className="text-2xl font-black text-slate-900 capitalize">
            Status: {order.orderStatus.replace(/_/g, ' ')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">From {order.restaurant?.name}</p>
        </div>

        <div className="bg-rose-50 px-4 py-2.5 rounded-2xl text-center border border-rose-100">
          <span className="text-xs text-slate-500 font-semibold block">Est. Delivery</span>
          <span className="text-base font-extrabold text-brand-orange">25 - 35 Min</span>
        </div>
      </div>

      {/* Visual Timeline Drawer */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-6">Live Delivery Progress</h3>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          {/* Progress bar line */}
          <div className="hidden md:block absolute top-5 left-0 right-0 h-1 bg-slate-100 z-0">
            <div
              className="h-full bg-brand-orange transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.status} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-brand-orange text-white ring-4 ring-rose-100'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div className="text-left md:text-center">
                  <p
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-brand-orange' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 hidden md:block">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items list */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm pb-3 border-b border-slate-100">
            Ordered Items
          </h3>
          <div className="space-y-3">
            {order.items.map((i, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-medium">
                  {i.quantity}x {i.name}
                </span>
                <span className="font-bold text-slate-900">₹{i.price * i.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-extrabold text-slate-900">
            <span>Total Amount Paid</span>
            <span className="text-brand-orange">₹{order.total}</span>
          </div>
        </div>

        {/* Delivery Address & Contact */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm pb-3 border-b border-slate-100">
            Delivery Address
          </h3>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">{order.address?.name || 'Customer'}</p>
            <p>{order.address?.houseNo}, {order.address?.street}</p>
            <p>{order.address?.area}, {order.address?.city} - {order.address?.pincode}</p>
            <p className="text-slate-400">Phone: {order.address?.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Review Section when DELIVERED */}
      {order.orderStatus === 'DELIVERED' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Rate Your Experience</h3>

          {reviewSubmitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold text-center">
              Thank you for your feedback! Your review helps us serve you better.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-600 mb-2 block">Rating</span>
                <Rating value={reviewRating} onChange={setReviewRating} readonly={false} size="lg" />
              </div>
              <textarea
                placeholder="Share your thoughts about the food taste, delivery speed..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-brand-orange"
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="bg-brand-orange text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-orange-600"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
