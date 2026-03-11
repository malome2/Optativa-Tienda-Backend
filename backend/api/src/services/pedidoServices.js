const Pedido = require('../models/pedido');
const Pagament = require('../models/pagament');
const Direccio = require('../models/direccio');
const Carrito = require('../models/carrito');

const crearPedido = async (usuariId, addressData, metode) => {
    // Obtenir la cistella poblada
    const carrito = await Carrito.findOne({ usuari: usuariId }).populate('jocs.joc');
    if (!carrito || carrito.jocs.length === 0) {
        throw new Error('La cistella és buida');
    }

    // Calcular total
    const total = carrito.jocs.reduce((sum, item) => {
        return sum + item.joc.preu * item.quantitat;
    }, 0);

    // Crear direcció
    const direccio = await Direccio.create({ ...addressData, usuari: usuariId });

    // Crear pedido
    const pedido = await Pedido.create({
        usuari: usuariId,
        direccio: direccio._id,
        total: parseFloat(total.toFixed(2)),
        jocs: carrito.jocs.map(item => ({
            joc: item.joc._id,
            quantitat: item.quantitat
        }))
    });

    // Crear pagament
    await Pagament.create({ metode, pedido: pedido._id });

    // Buidar cistella
    carrito.jocs = [];
    await carrito.save();

    return pedido.populate(['direccio', { path: 'jocs.joc', select: 'titol preu' }]);
};

const getPedidosByUsuari = async (usuariId) => {
    return Pedido.find({ usuari: usuariId })
        .populate('direccio')
        .populate('jocs.joc', 'titol preu')
        .sort({ createdAt: -1 });
};

module.exports = { crearPedido, getPedidosByUsuari };
