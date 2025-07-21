import React, { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';

export default function Incomes() {
  const {
    incomes = [],
    totalIncome,
    fetchIncomes,
    addIncome,
    deleteIncome,
    loading,
    error,
    setError
  } = useFinance();

  // Get today's date in YYYY-MM-DD format for default value
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: getTodayDate() // Default to today's date
  });

  useEffect(() => {
    fetchIncomes();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (setError) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.amount ||
      !form.category ||
      !form.description ||
      !form.date
    ) {
      setError('All fields are required');
      return;
    }
    await addIncome({
      ...form,
      amount: Number(form.amount),
    });
    setForm({
      title: '',
      amount: '',
      category: '',
      description: '',
      date: getTodayDate() // Reset to today's date after submission
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      deleteIncome(id);
      setError && setError(null);
    }
  };

  // Get max date (today) to prevent future dates
  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-32 w-32 h-32 bg-purple-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-40 left-40 w-36 h-36 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          {/* Header */}
          <h1 className="text-4xl font-bold text-slate-800 mb-4 text-center">
            Manage Your <span className="text-blue-600">Incomes</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 text-center">Track and add your income sources effortlessly</p>

          {/* Total Income Card */}
          <div className="bg-green-50/50 rounded-2xl p-6 mb-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-600 uppercase tracking-wide">Total Income</div>
                  <div className="text-2xl font-bold text-green-700">₹{totalIncome()}</div>
                </div>
              </div>
              <div className="w-24 bg-green-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2 mb-6 text-center text-sm font-medium flex items-center justify-between" role="alert" aria-live="assertive">
              {error}
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700" aria-label="Dismiss error">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            aria-label="Add Income Form"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Salary"
                className="w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm p-3 text-blue-900 placeholder:text-gray-400 hover:border-blue-300"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <input
                id="amount"
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g., 50000"
                className="w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm p-3 text-blue-900 placeholder:text-gray-400 hover:border-blue-300"
                required
                min="1"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm p-3 text-blue-900 hover:border-blue-300"
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="Salary">Salary</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Investments">Investments</option>
                <option value="Stocks">Stocks</option>
                <option value="Bank">Bank Transfer</option>
                <option value="YouTube">YouTube</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <div className="relative">
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  max={getMaxDate()} // Prevent future dates
                  className="w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm p-3 text-blue-900 cursor-pointer hover:border-blue-300"
                  required
                  aria-label="Select income date"
                />
                {/* Custom styling for date picker icon */}
                <style jsx>{`
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    border-radius: 4px;
                    margin-right: 2px;
                    opacity: 0.6;
                    filter: invert(0.2) sepia(1) saturate(5) hue-rotate(200deg);
                  }
                  input[type="date"]::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                  }
                `}</style>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input
                id="description"
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g., Monthly salary from job"
                className="w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm p-3 text-blue-900 placeholder:text-gray-400 hover:border-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-bold shadow hover:from-blue-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 hover:shadow-md transform hover:scale-105 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Income'
              )}
            </button>
          </form>

          {/* Income List */}
          <h2 className="text-2xl font-bold text-slate-800 mb-4">All Incomes</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium">Loading incomes...</p>
              </div>
            </div>
          ) : incomes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No incomes to display</p>
              <p className="text-slate-400 text-sm mt-2">Add some incomes to get started</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {incomes.map((income) => (
                <div
                  key={income._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-200 border border-slate-100 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{income.title}</p>
                      <p className="text-sm text-slate-500">{income.category} | {new Date(income.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                      <p className="text-sm text-slate-400">{income.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 font-bold">+₹{income.amount}</span>
                    <button
                      onClick={() => handleDelete(income._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label={`Delete income titled ${income.title}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
