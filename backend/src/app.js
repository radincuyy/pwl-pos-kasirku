const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { environment } = require('./config/environment');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoutes');
const healthRoutes = require('./routes/healthRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { apiRateLimit } = require('./middlewares/rateLimitMiddleware');

const app = express();

if (environment.trustProxy !== false) {
  app.set('trust proxy', environment.trustProxy);
}

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || environment.frontendOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: environment.requestBodyLimit }));
app.use(express.urlencoded({
  extended: true,
  limit: environment.requestBodyLimit
}));
app.use('/api', apiRateLimit);

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to KasirKu API'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/suppliers', supplierRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
