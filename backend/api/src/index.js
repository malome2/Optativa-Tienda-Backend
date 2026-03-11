require('dotenv').config();
const express = require('express');
const cors = require('cors'); // npm install cors
const connectDB = require('./config/db');
const productRoutes = require('./routes/jocRoutes');
const userRoutes = require('./routes/usuariRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

// CORS — permet que el frontend (Vite :5173) pugui cridar l'API
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

const startServer = async () => {
    try {
        await connectDB();
        console.log('API Ecommerce en marxa');

        app.use('/api/products', productRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/carrito', carritoRoutes);
        app.use('/api/pedidos', pedidoRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
    } catch (err) {
        console.error('Error iniciant el servidor:', err.message);
        process.exit(1);
    }
};

startServer();

app.get('/', (req, res) => res.send('API Ecommerce en marxa'));