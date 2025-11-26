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
        const { email, contrasenya } = req.body;

        const user = await userServices.getUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Credencials incorrectes' });

        const valid = await user.compararContrasenya(contrasenya);
        if (!valid) return res.status(401).json({ message: 'Credencials incorrectes' });

        const token = jwt.sign(
            { id: user._id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({
            status: 'success',
            token,
            user: {
                id: user._id,
                email: user.email,
                nom: user.nom,
                rol: user.rol
            }
        });

    } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
    }
};

module.exports = {
    crearUsuari,
    loginUsuari
};
