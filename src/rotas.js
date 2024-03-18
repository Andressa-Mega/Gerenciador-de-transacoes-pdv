const express = require('express');
const rotas = express();


const categoria = require('./controladores/categoria');
const usuario = require('./controladores/usuario');
const produto = require('./controladores/produto');
const cliente = require('./controladores/cliente');
const pedido = require('./controladores/pedido');

const multer = require('./intermediarios/multer');

const validarUsuarioCadastrado = require('./intermediarios/validarUsuarioCadastrado');
const schemaUsuario = require('./validacoes/schemaUsuario');
const schemaProduto = require('./validacoes/schemaProduto');
const schemaCliente = require('./validacoes/schemaCliente');
const schemaPedido = require('./validacoes/schemaPedido');

const { auth } = require("./intermediarios/autenticacao");

const { listarImagens } = require('./servicos/uploads');


rotas.get('/categoria', categoria.listarCategoria);

rotas.post('/usuario', validarUsuarioCadastrado(schemaUsuario), usuario.cadastrarUsuario);
rotas.post('/login', usuario.login);

rotas.use(auth);
rotas.get('/usuario', usuario.detalharPerfil);
rotas.put('/usuario', validarUsuarioCadastrado(schemaUsuario), usuario.atualizarPerfil);

rotas.post('/produto', multer.single('produto_imagem'), validarUsuarioCadastrado(schemaProduto), produto.cadastrarProduto);
rotas.get('/produto', produto.listarProduto);
rotas.get('/produto/:id', produto.detalharProduto);
rotas.delete('/produto/:id', produto.excluirProduto);
rotas.put('/produto/:id', multer.single('produto_imagem'), produto.atualizarProduto);

// Teste listando imagens
rotas.get('/arquivos', listarImagens);

rotas.post('/cliente', validarUsuarioCadastrado(schemaCliente), cliente.cadastrarCliente);
rotas.get('/cliente', cliente.listarClientes);
rotas.get('/cliente/:id', cliente.detalharCliente);
rotas.put('/cliente/:id', cliente.atualizarCliente);

rotas.post('/pedido', validarUsuarioCadastrado(schemaPedido), pedido.cadastrarPedido);
rotas.get('/pedido', pedido.listarPedidos);

module.exports = rotas;