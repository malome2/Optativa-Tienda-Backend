require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/jocRoutes');
const userRoutes = require('./routes/usuariRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { stripeWebhook } = require('./controllers/checkoutController');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const requestId = require('./middleware/requestId');
const httpLogger = require('./middleware/httpLogger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(requestId);
app.use(httpLogger);

// El webhook de Stripe necessita el body sense parsejar — ha d'anar ABANS de express.json()
app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

const startServer = async () => {
    try {
        await connectDB();

        app.use('/api/products', productRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/carrito', carritoRoutes);
        app.use('/api/pedidos', pedidoRoutes);
        app.use('/api/checkout', checkoutRoutes);
        app.use('/api/dashboard', dashboardRoutes);
        app.use('/api', healthRoutes);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // Endpoint temporal per comprovar observabilitat — eliminar abans de producció
        app.get('/api/debug/error', (req, res, next) => {
            next(new Error('Error de prova per observabilitat'));
        });

        app.use(errorHandler);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
    } catch (err) {
        console.error('Error iniciant el servidor:', err.message);
        process.exit(1);
    }
};

startServer();

app.get('/', (req, res) => res.send('API Ecommerce en marxa'));
