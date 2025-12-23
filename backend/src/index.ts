import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';
import adminProductsRoutes from './routes/admin/products';
import adminOrdersRoutes from './routes/admin/orders';
import adminDashboardRoutes from './routes/admin/dashboard';
import bannerRoutes from './routes/banners';
import couponRoutes from './routes/coupons';
import reviewRoutes from './routes/reviews';
import wishlistRoutes from './routes/wishlist';
import inventoryRoutes from './routes/inventory';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;

