const knex = required("../conexao");

async function listarcategoria(req, res) {

    try {
        const categoria = await knex('categoria');
        return res.json(categoria);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor"});
    }
}

module.exports = {
    listarcategoria
}