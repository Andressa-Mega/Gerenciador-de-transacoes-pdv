const express = require('express');

const rotas = express();

rotas.get('/', (req, res) => {
    res.send(200);
});


module.exports = rotas;