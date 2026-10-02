import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
import connectDB from './database/db.js'
import cors from 'cors'
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'

const app = express();
const PORT = process.env.PORT || 3000;
const developmentOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
];
const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.NODE_ENV === 'production' ? [] : developmentOrigins)
].filter(Boolean);

//middleware

app.disable('x-powered-by');
app.use((_, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});
app.use(express.json({ limit: '1mb' }));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, '') === cleanOrigin);

        if (isAllowed) {
            return callback(null, true);
        }
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true
}))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/order', orderRoute)

app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.name === 'MulterError' || error.status === 400 ? 400 : 500;
    const message = status === 400 ? 'Upload rejected. Images must be under 5 MB each.' : 'Request could not be completed';
    if (status === 500) console.error('Request failed:', error.message);
    return res.status(status).json({ success: false, message });
});

//http://localhost:8000/api/v1/user/register

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port: ${PORT}`);
});
