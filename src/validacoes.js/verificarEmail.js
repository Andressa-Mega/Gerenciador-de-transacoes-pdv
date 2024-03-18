const knex = require('../conexao');

const verificarEmail = async (req, res) => {
    const emailExiste = await knex('usuarios').where({ email }).first();

    if (emailExiste) {
        return res.status(400).json("O email informado já existe!")
    }
};

module.exports = verificarEmail;