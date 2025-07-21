const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Auth routes (login/signup)
app.use('/api/v1', require('./routes/auth'));

// Dynamically load all routes in /routes (for transactions, etc.)
readdirSync('./routes').forEach(routeFile => {
  // Avoid loading auth.js twice
  if (routeFile !== 'auth.js') {
    app.use('/api/v1', require('./routes/' + routeFile));
  }
});

// 404 handler for unknown API endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// Start server and connect to DB
const server = () => {
  db();
  app.listen(PORT, () => {
    console.log('listening to port:', PORT);
  });
};

server();
