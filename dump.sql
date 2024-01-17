create database gerenciadorpdv;

create table usuarios (
    id serial primary key,
    nome varchar(255) not null,
    email varchar(255) unique not null,
    senha varchar(255) not null
);

create table categorias (
    id serial primary key,
    descricao varchar(255)
);

create table transacoes (
    id serial primary key,
    descricao varchar(255),
    valor int,
    data timestamptz,
    categoria_id integer references categorias(id),
    usuarios_id integer references usuarios(id),
    tipo varchar(255)
);

INSERT INTO categorias (descricao) VALUES 
    ('Alimentação'),
    ('Assinaturas e serviços'),
    ('Casa'),
    ('Mercado'),
    ('Cuidados Pessoais'),
    ('Educação'),
    ('Familia'),
    ('Lazer'),
    ('Pets'),
    ('Presentes'),
    ('Roupas'),
    ('Saúde'),
    ('Transporte'),
    ('Salário'),
    ('Vendas'),
    ('Outras receitas'),
    ('Outras despesas');
