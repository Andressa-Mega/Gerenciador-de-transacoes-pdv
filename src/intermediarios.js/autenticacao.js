const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).json({ message: "O token é obrigatório." });
    }

    if (!authorization.includes("Bearer")) {

        return res.status(400).json({ code: 609, message: "O token é inválido." });
    }

    const token = authorization.split(" ")[1];

    try {
        const { id } = jwt.verify(token, process.env.JWT_PASS);

        req.usuario = { id };
        next();
    } catch (e) {
        return res.status(400).json({ code: 609, message: "O token é inválido." });
    }
};

module.exports = { auth };