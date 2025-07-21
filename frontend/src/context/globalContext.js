import React, { useContext, useState } from "react"
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    const token = localStorage.getItem('token');

    // Add Income
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Error adding income");
        }
    }

    // Get Incomes
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIncomes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching incomes");
        }
    }

    // Delete Income
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting income");
        }
    }

    // Add Expense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Error adding expense");
        }
    }

    // Get Expenses
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching expenses");
        }
    }

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting expense");
        }
    }

    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    }

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        return history.slice(0, 3)
    }

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)
