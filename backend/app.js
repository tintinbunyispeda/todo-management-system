const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/todos', todoRoutes);

// Root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running' });
});

module.exports = app;
