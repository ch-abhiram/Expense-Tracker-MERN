const Income = require("../models/IncomeModel");

// Create a new income for the logged-in user
exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    // Validations
    if (!title || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        const income = new Income({
            title,
            amount,
            category,
            description,
            date,
            user: req.user.id   // Set by your JWT auth middleware
        });
        await income.save();
        res.status(200).json({ message: 'Income Added' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all incomes for the logged-in user
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete an income (only if it belongs to the logged-in user)
exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Income.findOneAndDelete({ _id: id, user: req.user.id });
        if (!deleted) {
            return res.status(404).json({ message: "Income not found or unauthorized" });
        }
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
