const express = require('express');
const knex = require('../conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        if (!nome || !email || !cpf || !cep || !rua || !numero || !bairro || !cidade || !estado) {
            return res.status(400).json({ message: "Nome, Email, cpf e demais campos são obrigatórios!" });
        }

        const novoCliente = {
            nome,
            email,
            cpf,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado
        };

        const verificarEmailExistente = await knex('clientes').where({ email }).first();
        if (verificarEmailExistente) {
            return res.status(400).json({ message: "O email informado já existe!" });
        }

        const verificarCpfExistente = await knex('clientes').where({ cpf }).first();
        if (verificarCpfExistente) {
            return res.status(400).json({ message: "O cpf informado já existe!" });
        }

        const cliente = await knex('clientes').insert(novoCliente);
        return res.status(201).json("O cliente foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};


const listarClientes = async (req, res) => {

    try {

        if (!req.usuario) {
            return res.status(400).json({ mensagem: "Cliente não encontrado" });
        }

        const cliente = await knex('clientes');
        return res.status(200).json(cliente);

    } catch (error) {

        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

async function detalharCliente(req, res) {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body
    const { id } = req.params

    try {

        const cliente = await knex('clientes').where({ id }).select('clientes.*').first()

        if (!cliente) {
            return res.status(400).json({ mensagem: "Cliente não encontrado" });
        }
        return res.status(200).json(cliente);

    } catch (error) {
        return res.status(400).json({ message: "Erro interno do Servidor" })

    }
}

const atualizarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    let { id } = req.params;

    if (!nome || !email || !cpf) {
        return res.status(400).json({ message: "Nome, email e cpf são obrigatórios!" });
    }

    try {

        const cliente = await knex("clientes").where({ id }).select("nome", "email").first();

        if (!cliente) {
            return res.status(400).json({ mensagem: "Cliente não encontrado" });
        }

        const editarCliente = {
            nome,
            email,
            cpf,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado
        };

        const verificarEmailExistente = await knex('clientes').where({ email }).first();
        if (verificarEmailExistente) {
            return res.status(400).json({ message: "O email informado já existe!" });
        }

        const verificarCpfExistente = await knex('clientes').where({ cpf }).first();
        if (verificarCpfExistente) {
            return res.status(400).json({ message: "O cpf informado já existe!" });
        }

        const clienteAtualizado = await knex('clientes').update(editarCliente).where({ id }).returning('*');

        return res.json("Cliente atualizado com sucesso.");

    } catch (error) {
        return res.status(400).json({ message: "Erro interno do Servidor" })
    }

}

module.exports = {
    cadastrarCliente,
    listarClientes,
    detalharCliente,
    atualizarCliente
};