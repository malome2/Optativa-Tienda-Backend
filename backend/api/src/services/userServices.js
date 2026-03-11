const jwt = require('jsonwebtoken'); // ← FIX: faltava aquest import
const Usuari = require('../models/usuari');
const generarTokens = require("./tokenServices");

const login = async (data) => {
    const { email, contrasenya } = data;

    const user = await Usuari.findOne({ email });
    if (!user) throw new Error("Email o contrasenya incorrectes");

    const valid = await user.compararContrasenya(contrasenya);
    if (!valid) throw new Error("Email o contrasenya incorrectes");

    const { accessToken, refreshToken } = generarTokens(user._id);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    return { accessToken, refreshToken, user };
};

const refresh = async (refreshToken) => {
    const user = await Usuari.findOne({ "refreshTokens.token": refreshToken });
    if (!user) throw new Error("Refresh token no registrat");

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        throw new Error("Refresh token caducat");
    }

    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);

    const { accessToken, refreshToken: nouRefresh } = generarTokens(user._id);

    user.refreshTokens.push({ token: nouRefresh });
    await user.save();

    return { accessToken, refreshToken: nouRefresh };
};

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
    login,
    refresh,
    createUser,
    getUserByEmail,
    getUserById
};