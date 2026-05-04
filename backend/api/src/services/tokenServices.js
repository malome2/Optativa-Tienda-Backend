const jwt = require("jsonwebtoken");

const generarTokens = (idUsuari, rol) => {

    const accessToken = jwt.sign(
        { id: idUsuari, rol },
        process.env.JWT_ACCES_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: idUsuari, rol },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};

module.exports = generarTokens;
