const jwt = require('jsonwebtoken');
const userServices = require('../services/userServices');

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
            await userServices.login(req.body); // <--- aquí enviamos {email, contrasenya}

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

module.exports = {
    crearUsuari,
    loginUsuari,
    refreshToken
};