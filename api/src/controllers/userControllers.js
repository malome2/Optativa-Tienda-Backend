const userServices = require('../ServicesuserServicess/userServicess');

const crearUsuari = async (req, res) => {
    try {
        const user = await userServices.createUser(req.body);
        return res.status(201).json({ status: 'success', data: user });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const obtenerUsuari = async (req, res) => {
    try {
        const user = await userServices.getuserById(req.params.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuari no trobat' });
        return res.json({ status: 'success', data: user });
    } catch (err) {

        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const modificarUsuari = async (req, res) => {
    try {
        const user = await userServices.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuari no trobat' });
        return res.json({ status: 'success', data: user });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const borrarUsuari = async (req, res) => {
    try {
        const user = await userServices.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuari no trobat' });
        return res.json({ status: 'success', message: 'Usuari eliminat correctament' });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

module.exports = {
    crearUsuari,
    obtenerUsuari,
    modificarUsuari,
    borrarUsuari
};
