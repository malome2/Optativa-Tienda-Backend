const jocService = require('../services/jocService');

const crearJoc = async (req, res) => {
    try {
        const joc = await jocService.createJoc(req.body);
        return res.status(201).json({ status: 'success', data: joc });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const obtenerJocs = async (req, res) => {
    try {
        const filter = {};
        if (req.query.categoria) filter.categoria = req.query.categoria;
        if (req.query.minPrice) filter.preu = { $gte: Number(req.query.minPrice) };
        if (req.query.maxPrice) {
            filter.preu = filter.preu || {};
            filter.preu.$lte = Number(req.query.maxPrice);
        }

        const options = {
            page: req.query.page,
            limit: req.query.limit,
            sort: req.query.sort
        };

        const result = await jocService.getAllJocs(filter, options);
        return res.json({ status: 'success', ...result });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

const obtenerJoc = async (req, res) => {
    try {
        const joc = await jocService.getJocById(req.params.id);
        if (!joc) return res.status(404).json({ status: 'error', message: 'Joc no trobat' });
        return res.json({ status: 'success', data: joc });
    } catch (err) {
        
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const modificarJoc = async (req, res) => {
    try {
        const joc = await jocService.updateJoc(req.params.id, req.body);
        if (!joc) return res.status(404).json({ status: 'error', message: 'Joc no trobat' });
        return res.json({ status: 'success', data: joc });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const borrarJoc = async (req, res) => {
    try {
        const joc = await jocService.deleteJoc(req.params.id);
        if (!joc) return res.status(404).json({ status: 'error', message: 'Joc no trobat' });
        return res.json({ status: 'success', message: 'Joc eliminat correctament' });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

module.exports = {
    crearJoc,
    obtenerJocs,
    obtenerJoc,
    modificarJoc,
    borrarJoc
};
