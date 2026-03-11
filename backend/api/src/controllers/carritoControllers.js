const carritoServices = require('../services/carritoServices');

// GET /api/carrito — Obtenir la cistella de l'usuari autenticat
const getCarrito = async (req, res) => {
    try {
        const carrito = await carritoServices.getOrCreateCarrito(req.usuariId);
        return res.json({ status: 'success', data: carrito });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// POST /api/carrito — Afegir un joc
const addJoc = async (req, res) => {
    try {
        const { jocId, quantitat } = req.body;
        if (!jocId) return res.status(400).json({ status: 'error', message: 'jocId és obligatori' });

        const carrito = await carritoServices.addJoc(req.usuariId, jocId, quantitat || 1);
        return res.json({ status: 'success', data: carrito });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

// PUT /api/carrito/:jocId — Actualitzar quantitat
const updateQuantitat = async (req, res) => {
    try {
        const { quantitat } = req.body;
        if (quantitat === undefined) return res.status(400).json({ status: 'error', message: 'quantitat és obligatòria' });

        const carrito = await carritoServices.updateQuantitat(req.usuariId, req.params.jocId, quantitat);
        return res.json({ status: 'success', data: carrito });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

// DELETE /api/carrito/:jocId — Eliminar un joc
const removeJoc = async (req, res) => {
    try {
        const carrito = await carritoServices.removeJoc(req.usuariId, req.params.jocId);
        return res.json({ status: 'success', data: carrito });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

// DELETE /api/carrito — Buidar la cistella
const clearCarrito = async (req, res) => {
    try {
        await carritoServices.clearCarrito(req.usuariId);
        return res.json({ status: 'success', message: 'Cistella buidada' });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

module.exports = {
    getCarrito,
    addJoc,
    updateQuantitat,
    removeJoc,
    clearCarrito
};