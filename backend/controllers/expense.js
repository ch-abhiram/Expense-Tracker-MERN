const Expense = require("../models/ExpenseModel");

// Create an expense
exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    if (!title || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        const expense = new Expense({
            title,
            amount,
            category,
            description,
            date,
            user: req.user.id    // You'll set this via authentication middleware
        });
        await expense.save();
        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all of the user's expenses
exports.getExpense = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete an expense (optionally, check user owns it)
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await Expense.findOneAndDelete({ _id: id, user: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
