require('dotenv').config({ path: '../../.env' });
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/jocRoutes');

const app = express();
app.use(express.json());

const startServer = async () => {
    try {
        // Espera que MongoDB es connecti
        await connectDB();
        console.log('API Ecommerce en marxa');

        // Muntem les rutes després de connectar
        app.use('/api/products', productRoutes);

        // Escoltem el port
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
    } catch (err) {
        console.error('Error iniciant el servidor:', err.message);
        process.exit(1);
    }
};

// Arrenca el servidor
startServer();

// Ruta arrel opcional
app.get('/', (req, res) => res.send('API Ecommerce en marxa'));
