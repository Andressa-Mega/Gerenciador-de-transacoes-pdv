create database pdv;


create table usuarios (
  id serial primary key,
  nome text not null,
  email text not null,
  senha text not null
);

 create table categoria(
  id serial primary key,
  descricao text not null
 );

INSERT INTO categoria (descricao) VALUES
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos (
    id serial primary key,
    descricao text not null,
    quantidade_estoque integer not null,
    valor integer not null,
    categoria_id integer references categoria(id) not null
);

create table clientes (
    id serial primary key,
    nome text not null,
    email text unique not null,
    cpf text unique not null,
    cep text not null,
    rua text not null,
    numero text,
    bairro text not null,
    cidade text not null,
    estado char(2) not null
);


create table pedidos (
    id serial primary key,
    cliente_id int not null,
    observacao text,
    valor_total int not null
);

create table pedido_produtos (
    id serial primary key,
    pedido_id int not null,
    produto_id int not null,
    quantidade_produto int not null,
    valor_produto int not null,
    foreign key (pedido_id) references pedidos(id),
    foreign key (produto_id) references produtos(id)
);

alter table produtos
add column produto_imagem text;