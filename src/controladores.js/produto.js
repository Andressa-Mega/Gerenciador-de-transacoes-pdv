const express = require("express");
const knex = require("../conexao");
const { uploadImagem, excluirImagem } = require("../servicos/uploads");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { originalname, buffer, mimetype } = req.file;

  try {
    const categoria = await knex("categoria")
      .where({ id: categoria_id })
      .first();

    if (!categoria) {
      return res
        .status(400)
        .json({
          mensagem: "Não foi possível encontrar a categoria informada.",
        });
    }

    const produtoDuplicado = await knex("produtos")
      .where({ descricao })
      .first();

    if (produtoDuplicado) {
      return res
        .status(400)
        .json({ mensagem: "Este produto já está cadastrado." });
    }

    let produto = {
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    };

    let novoProduto = await knex("produtos").insert(produto).returning("*");

    if (!novoProduto) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível cadastrar o produto." });
    }

    const id = novoProduto[0].id;

    const produto_imagem = await uploadImagem(
      `produtos/${id}/${originalname}`,
      buffer,
      mimetype
    );

    novoProduto = await knex("produtos")
      .update({
        produto_imagem: produto_imagem.url,
      })
      .where({ id })
      .returning("*");

    return res.status(201).json({ novoProduto: novoProduto[0] });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { id } = req.params;

  try {
    const produto = await knex("produtos")
      .select("produtos.*", "categoria.descricao as categoria_nome")
      .join("categoria", "produtos.categoria_id", "categoria.id")
      .where("produtos.id", id)
      .first();

    if (!produto) {
      return res.status(400).json({ mensagem: `Produto não foi encontrado.` });
    }

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const listarProduto = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    const produtos = await knex("produtos").select("produtos.*");

    if (!categoria_id) {
      return res.status(200).json(produtos);
    }

    const filtrarCategoria = await knex("produtos")
      .select("produtos.*")
      .where("categoria_id", categoria_id);

    if (filtrarCategoria.length === 0) {
      return res.status(400).json({ mensagem: `Produto não foi encontrado.` });
    }

    return res.status(200).json(filtrarCategoria);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produtoExiste = await knex("produtos")
      .select("produtos.*")
      .where("id", id);

    if (produtoExiste.length === 0) {
      return res.status(400).json({ mensagem: `Produto não foi encontrado.` });
    }

    const possuiPedido = await knex("pedido_produtos")
      .select("pedido_produtos.*")
      .where("produto_id", id);

    if (possuiPedido.length > 0) {
      return res
        .status(400)
        .json({
          mensagem: `Possui ${possuiPedido.length} pedidos para esse produto, não foi possível excluir.`,
        });
    }

    let imagemProduto = produtoExiste[0].produto_imagem;

    if (imagemProduto !== null) {
      await excluirImagem(imagemProduto);
    }

    const excluirProduto = await knex("produtos")
      .del("produtos.*")
      .where("id", id);

    return res.status(200).json("Produto excluido com sucesso!");
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor1" });
  }
};

const atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { originalname, buffer, mimetype } = req.file;

  try {
    const produtoDuplicado = await knex("produtos").where({ id }).first();

    if (!produtoDuplicado) {
      return res
        .status(400)
        .json({ mensagem: "Este produto não está cadastrado." });
    }

    const editarProduto = {
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    };

    await excluirImagem(
      produtoDuplicado.produto_imagem.slice(
        produtoDuplicado.produto_imagem.indexOf("/produtos") + 1
      )
    );

    const upload = await uploadImagem(
      `produtos/${produtoDuplicado.id}/${originalname}`,
      buffer,
      mimetype
    );
    const novoProduto = await knex("produtos")
      .update({
        produto_imagem: upload.url,
      })
      .where({ id })
      .returning("*");

    if (!novoProduto) {
      return res.status(400).json({ mensagem: "O produto não foi atualizado" });
    }
    const produtoAtualizado = await knex("produtos")
      .update(editarProduto)
      .where({ id })
      .returning("*");

    return res.status(201).json({ produtoAtualizado: produtoAtualizado[0] });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro interno do servidor.1" });
  }
};

module.exports = {
  cadastrarProduto,
  detalharProduto,
  listarProduto,
  excluirProduto,
  atualizarProduto,
};