const Usuari = require('../models/usuari');

const createUser = async (data) => {
    const { email, contrasenya } = data;

    if (!email || !contrasenya)
        throw new Error('Email i contrasenya són obligatoris');

    const existe = await Usuari.findOne({ email });
    if (existe) throw new Error('Email ja en ús');

    const user = new Usuari(data);
    return await user.save();
};

const getUserByEmail = async (email) => {
    return await Usuari.findOne({ email });
};

const getUserById = async (id) => {
    return await Usuari.findById(id).select('-contrasenya');
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById
};
