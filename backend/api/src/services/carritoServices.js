const Carrito = require('../models/carrito');

// Obtenir o crear la cistella d'un usuari
const getOrCreateCarrito = async (usuariId) => {
    let carrito = await Carrito.findOne({ usuari: usuariId }).populate('jocs.joc');
    if (!carrito) {
        carrito = await Carrito.create({ usuari: usuariId, jocs: [] });
    }
    return carrito;
};

// Afegir o incrementar un joc
const addJoc = async (usuariId, jocId, quantitat = 1) => {
    let carrito = await Carrito.findOne({ usuari: usuariId });
    if (!carrito) {
        carrito = new Carrito({ usuari: usuariId, jocs: [] });
    }

    const index = carrito.jocs.findIndex(item => item.joc.toString() === jocId);
    if (index >= 0) {
        carrito.jocs[index].quantitat += quantitat;
    } else {
        carrito.jocs.push({ joc: jocId, quantitat });
    }

    await carrito.save();
    return carrito.populate('jocs.joc');
};

// Actualitzar la quantitat d'un joc (si quantitat = 0, l'elimina)
const updateQuantitat = async (usuariId, jocId, quantitat) => {
    const carrito = await Carrito.findOne({ usuari: usuariId });
    if (!carrito) throw new Error('Cistella no trobada');

    if (quantitat <= 0) {
        carrito.jocs = carrito.jocs.filter(item => item.joc.toString() !== jocId);
    } else {
        const index = carrito.jocs.findIndex(item => item.joc.toString() === jocId);
        if (index >= 0) {
            carrito.jocs[index].quantitat = quantitat;
        } else {
            throw new Error('Joc no trobat a la cistella');
        }
    }

    await carrito.save();
    return carrito.populate('jocs.joc');
};

// Eliminar un joc de la cistella
const removeJoc = async (usuariId, jocId) => {
    const carrito = await Carrito.findOne({ usuari: usuariId });
    if (!carrito) throw new Error('Cistella no trobada');

    carrito.jocs = carrito.jocs.filter(item => item.joc.toString() !== jocId);
    await carrito.save();
    return carrito.populate('jocs.joc');
};

// Buidar la cistella
const clearCarrito = async (usuariId) => {
    const carrito = await Carrito.findOne({ usuari: usuariId });
    if (!carrito) throw new Error('Cistella no trobada');

    carrito.jocs = [];
    await carrito.save();
    return carrito;
};

module.exports = {
    getOrCreateCarrito,
    addJoc,
    updateQuantitat,
    removeJoc,
    clearCarrito
};