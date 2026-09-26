import React, { useState, useEffect } from 'react';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import API from '../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const restRes = await API.get('/restaurants/my/profile');
      if (restRes.data) {
        const revRes = await API.get(`/reviews/${restRes.data._id}`);
        if (revRes.data) setReviews(revRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading reviews..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Customer Feedback & Reviews</h1>
        <p className="text-xs text-slate-500">Read what customers are saying about your kitchen</p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">{rev.user?.name || 'Verified Customer'}</span>
              <Rating value={rev.rating} />
            </div>
            <p className="text-xs text-slate-600">{rev.comment || 'No comment added.'}</p>
            <span className="text-[10px] text-slate-400 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
