const pedidoService = require('../services/pedidoServices');

const checkout = async (req, res) => {
    try {
        const { pais, carrer, pis, codiPostal, metode } = req.body;

        if (!pais || !carrer || !codiPostal) {
            return res.status(400).json({ status: 'error', message: 'Pais, carrer i codi postal són obligatoris' });
        }
        if (!metode) {
            return res.status(400).json({ status: 'error', message: 'Mètode de pagament obligatori' });
        }

        const pedido = await pedidoService.crearPedido(
            req.usuariId,
            { pais, carrer, pis, codiPostal },
            metode
        );

        return res.status(201).json({ status: 'success', data: pedido });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const getMeusPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoService.getPedidosByUsuari(req.usuariId);
        return res.json({ status: 'success', data: pedidos });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = { checkout, getMeusPedidos };
