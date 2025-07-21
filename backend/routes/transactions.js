const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const auth = require('../middleware/auth');

const router = require('express').Router();

// Routes for Income
router.post('/add-income', auth, addIncome);
router.get('/get-incomes', auth, getIncomes);
router.delete('/delete-income/:id', auth, deleteIncome);

// Routes for Expense
router.post('/add-expense', auth, addExpense);
router.get('/get-expenses', auth, getExpense);
router.delete('/delete-expense/:id', auth, deleteExpense);

module.exports = router;
