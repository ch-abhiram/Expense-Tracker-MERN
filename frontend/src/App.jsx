import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm.jsx';
import SignupForm from './components/auth/SignupForm.jsx';
import { useAuth } from './context/AuthContext.jsx';
import React from 'react';
import Dashboard from './components/Dashboard.jsx';
import Incomes from './components/Incomes.jsx';
import Expenses from './components/Expenses.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md border border-blue-200'
      : 'px-4 py-2 rounded-lg font-semibold hover:bg-blue-500/80 hover:text-white transition';
  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-lg rounded-b-2xl border-b border-blue-100 px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 mb-6">
      <div className="font-extrabold text-2xl text-blue-700 tracking-tight mb-2 md:mb-0">
        <NavLink to="/dashboard" className="hover:underline">Expense Tracker</NavLink>
      </div>
      {token && (
        <div className="flex gap-2 mb-2 md:mb-0">
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/incomes" className={navLinkClass}>Incomes</NavLink>
          <NavLink to="/expenses" className={navLinkClass}>Expenses</NavLink>
        </div>
      )}
      <div>
        {token ? (
          <button onClick={handleLogout} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:from-blue-600 hover:to-purple-600 transition">Logout</button>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            <NavLink to="/signup" className={navLinkClass}>Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/incomes" element={<ProtectedRoute><Incomes /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl font-bold text-red-500">404 - Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
