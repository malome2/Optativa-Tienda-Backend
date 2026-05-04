const Usuari = require('../models/usuari');
const Pedido = require('../models/pedido');

const getDashboardUsuari = async (usuariId) => {
    const usuari = await Usuari.findById(usuariId).select('-contrasenya -refreshTokens');
    if (!usuari) throw new Error('Usuari no trobat');

    const pedidos = await Pedido.find({ usuari: usuariId })
        .populate('jocs.joc', 'titol preu')
        .populate('direccio')
        .sort({ createdAt: -1 });

    const totalGastat = pedidos
        .filter(p => p.estat === 'pagat')
        .reduce((sum, p) => sum + p.total, 0);

    return { usuari, pedidos, totalGastat: parseFloat(totalGastat.toFixed(2)) };
};

const getDashboardAdmin = async () => {
    const usuaris = await Usuari.find()
        .select('-contrasenya -refreshTokens')
        .sort({ createdAt: -1 });

    const pedidos = await Pedido.find()
        .populate('usuari', 'nom email')
        .populate('jocs.joc', 'titol preu')
        .sort({ createdAt: -1 });

    const totalVendes = pedidos
        .filter(p => p.estat === 'pagat')
        .reduce((sum, p) => sum + p.total, 0);

    const pedidosPerEstat = pedidos.reduce((acc, p) => {
        acc[p.estat] = (acc[p.estat] || 0) + 1;
        return acc;
    }, {});

    return {
        stats: {
            totalUsuaris: usuaris.length,
            totalPedidos: pedidos.length,
            totalVendes: parseFloat(totalVendes.toFixed(2)),
            pedidosPerEstat
        },
        usuaris,
        pedidos
    };
};

module.exports = { getDashboardUsuari, getDashboardAdmin };
