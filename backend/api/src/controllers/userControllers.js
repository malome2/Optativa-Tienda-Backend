const jwt = require('jsonwebtoken');
const userServices = require('../services/userServices');

const updateMe = async (req, res) => {
    try {
        const { nom, email, telefon } = req.body;
        const user = await userServices.updateUser(req.usuariId, { nom, email, telefon });
        return res.json({ status: 'success', data: user });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const updateUsuari = async (req, res) => {
    try {
        const user = await userServices.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuari no trobat' });
        return res.json({ status: 'success', data: user });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const deleteUsuari = async (req, res) => {
    try {
        const user = await userServices.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuari no trobat' });
        return res.json({ status: 'success', message: 'Usuari eliminat correctament' });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const crearUsuari = async (req, res) => {
    try {
        const user = await userServices.createUser(req.body);
        return res.status(201).json({ status: 'success', data: user });
    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

const loginUsuari = async (req, res) => {
    try {
        const { accessToken, refreshToken, user } =
            await userServices.login(req.body);

        req.log.info({
            requestId: req.requestId,
            userId: user._id,
            email: user.email
        }, 'User logged in successfully');

        res.json({
            status: "success",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                nom: user.nom,
                rol: user.rol
            }
        });

    } catch (err) {
        req.log.warn({
            requestId: req.requestId,
            email: req.body.email
        }, 'Invalid login attempt');

        res.status(400).json({ status: "error", message: err.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.body.refreshToken;
        const result = await userServices.refresh(token);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

const logoutUsuari = async (req, res) => {
    try {
        const token = req.body.refreshToken;
        await userServices.logout(token);

        req.log.info({
            requestId: req.requestId,
            userId: req.usuariId
        }, 'User logged out');

        res.json({ status: 'success', message: 'Sessió tancada' });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

module.exports = {
    crearUsuari,
    loginUsuari,
    refreshToken,
    logoutUsuari,
    updateMe,
    updateUsuari,
    deleteUsuari
};
