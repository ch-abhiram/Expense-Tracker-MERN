import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const FinanceContext = createContext();

export function useFinance() {
  return useContext(FinanceContext);
}

export function FinanceProvider({ children }) {
  const { token } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch incomes
  const fetchIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/v1/get-incomes');
      setIncomes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch incomes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/v1/get-expenses');
      setExpenses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  // Add income
  const addIncome = async (income) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/v1/add-income', income);
      await fetchIncomes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  // Add expense
  const addExpense = async (expense) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/v1/add-expense', expense);
      await fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  // Delete income
  const deleteIncome = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/v1/delete-income/${id}`);
      await fetchIncomes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete income');
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/v1/delete-expense/${id}`);
      await fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  // Totals
  const totalIncome = () => incomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const totalExpenses = () => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalBalance = () => totalIncome() - totalExpenses();

  // Recent transactions (last 3, sorted by date)
  const recentTransactions = () => {
    const all = [...incomes, ...expenses];
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    return all.slice(0, 3);
  };

  return (
    <FinanceContext.Provider value={{
      incomes,
      expenses,
      loading,
      error,
      fetchIncomes,
      fetchExpenses,
      addIncome,
      addExpense,
      deleteIncome,
      deleteExpense,
      totalIncome,
      totalExpenses,
      totalBalance,
      recentTransactions,
      setError
    }}>
      {children}
    </FinanceContext.Provider>
  );
} 