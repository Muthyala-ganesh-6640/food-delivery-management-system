import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import API from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get('/foods/categories/all');
      if (res.data) setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading food categories..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Food Categories</h1>
        <p className="text-xs text-slate-500">Explore meals by your favorite cuisine type</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id || cat.name}
            to={`/restaurants?cuisine=${encodeURIComponent(cat.name)}`}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-rose-50 overflow-hidden mb-4 group-hover:scale-105 transition-transform">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-brand-orange transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description || 'Tasty meals'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
