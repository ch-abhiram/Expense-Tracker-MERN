import React, { useEffect } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const {
    incomes = [],
    expenses = [],
    totalIncome,
    totalExpenses,
    totalBalance,
    recentTransactions,
    fetchIncomes,
    fetchExpenses,
    loading,
    error
  } = useFinance();

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
    // eslint-disable-next-line
  }, []);

  // Prepare chart data
  const allDates = Array.from(new Set([
    ...incomes.map(i => i.date),
    ...expenses.map(e => e.date)
  ])).sort((a, b) => new Date(a) - new Date(b));

  const incomeData = allDates.map(date => {
    const found = incomes.find(i => i.date === date);
    return found ? found.amount : 0;
  });
  const expenseData = allDates.map(date => {
    const found = expenses.find(e => e.date === date);
    return found ? found.amount : 0;
  });

  const chartData = {
    labels: allDates.map(d => new Date(d).toLocaleDateString()),
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(34,197,94)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: 'rgb(239,68,68)',
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(239,68,68)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            weight: '600'
          }
        }
      },
      title: { 
        display: true, 
        text: 'Income vs Expenses Over Time',
        font: {
          size: 18,
          weight: '700'
        },
        padding: 20,
        color: '#1e293b'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  const balance = totalBalance();
  const isPositiveBalance = balance >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-32 w-32 h-32 bg-purple-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-40 left-40 w-36 h-36 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Financial 
            <span className="text-blue-600"> Dashboard</span>
          </h1>
          <p className="text-xl text-slate-600">Track your financial journey and make informed decisions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Income Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-2xl">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600 uppercase tracking-wide">Total Income</div>
                <div className="text-3xl font-bold text-green-700">₹{totalIncome()}</div>
              </div>
            </div>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-2xl">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-red-600 uppercase tracking-wide">Total Expenses</div>
                <div className="text-3xl font-bold text-red-700">₹{totalExpenses()}</div>
              </div>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${isPositiveBalance ? 'ring-2 ring-blue-200' : 'ring-2 ring-orange-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${isPositiveBalance ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <svg className={`w-8 h-8 ${isPositiveBalance ? 'text-blue-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold uppercase tracking-wide ${isPositiveBalance ? 'text-blue-600' : 'text-orange-600'}`}>Current Balance</div>
                <div className={`text-3xl font-bold ${isPositiveBalance ? 'text-blue-700' : 'text-orange-700'}`}>₹{Math.abs(balance)}</div>
                {!isPositiveBalance && <div className="text-sm text-orange-500 font-medium">Deficit</div>}
              </div>
            </div>
            <div className={`w-full rounded-full h-2 ${isPositiveBalance ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <div className={`h-2 rounded-full ${isPositiveBalance ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`} style={{width: '75%'}}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
              <div className="h-96">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-slate-600 font-medium">Loading chart data...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                  </div>
                ) : allDates.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium">No data available</p>
                      <p className="text-slate-400 text-sm mt-2">Add some transactions to see your financial trends</p>
                    </div>
                  </div>
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 font-medium">{error}</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {recentTransactions().length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-400 font-medium">No recent transactions</p>
                    </div>
                  ) : (
                    recentTransactions().map((tx, index) => (
                      <div key={tx._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-200 border border-slate-100">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {tx.type === 'income' ? (
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{tx.title}</p>
                            <p className="text-xs text-slate-500">{tx.category}</p>
                            <p className="text-xs text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}