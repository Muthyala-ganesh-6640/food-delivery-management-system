import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Loader from '../components/Loader';
import API from '../services/api';

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await API.get('/foods?limit=50');
      if (res.data) setFoods(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Admin delete this food item?')) return;
    try {
      await API.delete(`/foods/${id}`);
      setFoods(foods.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading global food menu..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Global Food Catalog</h1>
        <p className="text-xs text-slate-500">Monitor all food items uploaded across restaurants</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {foods.map((food) => (
          <div key={food._id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <img src={food.image} alt={food.name} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{food.name}</h4>
                <p className="text-[11px] text-slate-400">{food.category}</p>
                <span className="font-extrabold text-slate-900 text-xs">₹{food.finalPrice || food.price}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => handleDelete(food._id)} className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Foods;
