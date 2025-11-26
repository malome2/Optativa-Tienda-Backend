const Usuari = require('../models/usuari');
const generarTokens = require("./tokenServices");

const login = async (data) => {
    const { email, contrasenya } = data; // <- extraemos email y contrasenya correctamente

    const user = await Usuari.findOne({ email });
    if (!user) throw new Error("Email o contrasenya incorrectes");

    // Ahora comparamos la contraseña con bcrypt
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

    // Verificar que el token és vàlid
    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        throw new Error("Refresh token caducat");
    }

    // ROTACIÓ: eliminar token antic
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);

    // Generar nous tokens
    const { accessToken, refreshToken: nouRefresh } = generarTokens(user._id);

    // Guardar el nou token
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
