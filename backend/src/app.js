require('dotenv').config();

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to KasirKu API'
  });
});

app.use('/api/health', healthRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
