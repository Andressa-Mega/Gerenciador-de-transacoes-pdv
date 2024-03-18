const knex = require('../conexao');
const send = require('../nodemailer');


const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {
        const clienteCadastrado = await knex('clientes').where('id', cliente_id).first();

        if (!clienteCadastrado) {
            return res.status(400).json({ mensagem: "Cliente nao existe" });
        }

        if (!clienteCadastrado.email) {

            return res.status(500).json({ mensagem: "Erro interno do servidor02" });
        }

        const produtos = [];
        let valorTotal = 0;

        for (let produto of pedido_produtos) {
            const produtoCadastrado = await knex('produtos').where({ id: produto.produto_id }).first();

            if (!produtoCadastrado) {
                return res.status(404).json({ mensagem: `O produto de id ${produto.produto_id} nao existe` });
            }

            if (produtoCadastrado.quantidade_estoque < produto.quantidade_produto) {
                return res.status(400).json({ mensagem: `O pedido não foi realizado pois há apenas ${produtoCadastrado.quantidade_estoque} produto(s) no estoque do produto de id ${produtoCadastrado.id}.` });
            }

            valorTotal += produtoCadastrado.valor;
            const { quantidade_estoque } = produtoCadastrado;
            const { quantidade_produto } = produto;
            produtoCadastrado.quantidade_estoque = quantidade_estoque - quantidade_produto;
            await knex('produtos').update({ quantidade_estoque: produtoCadastrado.quantidade_estoque }).where({ id: produto.produto_id });
            produtos.push(produtoCadastrado);
        }

        const pedido = await knex('pedidos').insert({ cliente_id, observacao, valor_total: valorTotal }).returning('*');

        for (produto of produtos) {
            await knex('pedido_produtos').insert({ pedido_id: pedido[0].id, produto_id: produto.id, quantidade_produto: produto.quantidade_estoque, valor_produto: produto.valor });
        }

        const email = {
            assunto: 'Pedido Cadastrado',
            corpoEmail: 'Seu pedido foi cadastrado com sucesso!'
        };

        let somaTotal = 0;
        for (let i = 0; i < produtos.length; i++) {
            somaTotal += produtos[i].valor;
        }

        const cadastroUsuario = {
            nome: clienteCadastrado.nome,
            id: pedido[0].id,
            produtos,
            somaTotal: (somaTotal / 100).toFixed(2)
        };

        const template = `
        <html>
            <body>
                <p>Seu pedido foi cadastrado! Detalhes:</p>
                <p>Nome: ${cadastroUsuario.nome}</p>
                <p>ID: ${cadastroUsuario.id}</p>
                <p>Valor Total: R$ ${cadastroUsuario.somaTotal}</p>
            </body>
        </html>
    `;

        if (!process.env.MAIL_FROM) {

            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }

        if (clienteCadastrado.email) {
            try {
                await send(clienteCadastrado.email, email.assunto, template);

            } catch (error) {

                return res.status(500).json({ mensagem: "Erro ao enviar e-mail" });
            }
        }

        return res.status(200).json({ mensagem: "Pedido cadastrado com sucesso" });

    } catch (error) {

        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};



const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        const pedidos = await knex('pedidos')
            .where(builder => {
                if (cliente_id) {
                    builder.where('cliente_id', cliente_id);
                }
            })
            .select('*');

        const resposta = [];

        for (const pedido of pedidos) {

            const pedido_produtos = await knex('pedido_produtos')
                .where({ pedido_id: pedido.id })
                .returning('*');

            resposta.push({ pedido, pedido_produtos });
        }

        return res.status(200).json(resposta);
    } catch (error) {

        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};


module.exports = {
    cadastrarPedido,
    listarPedidos
};