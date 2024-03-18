const express = require('express');
const knex = require('../conexao');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJWT');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        if ( !nome || !email || !senha ) {
            return res.status(400).json("Nome, email e senha são obrigatórios!")
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = {
            nome,
            email,
            senha: senhaCriptografada
        }

        const VerificarEmailExistente = await knex('usuarios').where({ email }).first();
        if (VerificarEmailExistente) {
            return res.status(400).json("O email informado já existe!")
        }

        const usuario = await knex('usuarios').insert(novoUsuario);
        return res.status(201).json(novoUsuario);
    } catch (error) {
        return res.status(400).json({ message: "Erro interno no servidor" })
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        if ( !email || !senha ) {
            return res.status(400).json( {message: "Requisição inválida"} )
        }

        const usuarioExiste = await knex('usuarios').where({ email }).first();

        if (!usuarioExiste) {
            return res.status(404).json({ message: "Usuário e/ou senha inválido(s)." })
        }

        const senhaDoUsuario = usuarioExiste.senha

        const senhaValida = await bcrypt.compare(senha, senhaDoUsuario)

        if (!senhaValida) {
            return res.status(400).json({ message: "Usuário e/ou senha inválido(s)." })
        }
        const token = jwt.sign({ id: usuarioExiste.id }, senhaJwt, { expiresIn: '8h' })
        return res.status(200).json({ token });

    } catch (error) {
        return res.status(400).json({ message: "Erro interno do Servidor" })
    }
};


async function detalharPerfil(req, res) {
    try {
        if (!req.usuario) {
            return res.status(400).json({ mensagem: "Usuario não encontrado" });
        }

        const usuario = await knex("usuarios").where({ id: req.usuario.id }).select("id", "nome", "email").first()

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json({ message: "Erro interno do Servidor" })

    }
}

const atualizarPerfil = async (req, res) => {
    const { id } = req.usuario;
    const { nome, email, senha } = req.body;
    try {
        const VerificarEmailExistente = await knex('usuarios').where({ email }).andWhere("id", "!=", id).first();

        if (VerificarEmailExistente) {
            return res.status(400).json("O email informado já existe!")
        }
        
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const atualizarUsuario = {
            nome,
            email,
            senha: senhaCriptografada
        }

        const usuarioAtualizado = await knex('usuarios').update(atualizarUsuario).where({ id }).returning('*');
        
        return res.json("Usuário atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json("Erro interno do servidor.");
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharPerfil,
    atualizarPerfil
}