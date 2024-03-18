const joi = require('joi');
const schemaProduto = joi.object({
    descricao: joi.string().required().messages({
        'any.required': 'O campo descrição é obrigatório.',
        'string.empty': 'O campo descrição não pode ser vazio.'
    }),
    quantidade_estoque: joi.number().integer().greater(0).required().messages({
        'any.required': 'O campo quantidade_estoque é obrigatório.',
        'number.base': 'O campo quantidade_estoque precisa ser numérico.',
        'number.greater': 'Informe uma quantidade válida.',
        'number.integer': 'Campo quantidade deve receber um valor inteiro.'
    }),
    valor: joi.number().integer().greater(0).required().messages({
        'any.required': 'O campo valor é obrigatório.',
        'number.base': 'O campo valor não pode ser vazio.',
        'number.greater': 'Informe um valor válido.',
        'number.integer': 'Campo quantidade deve receber um valor inteiro.'
    }),
    categoria_id: joi.number().integer().greater(0).required().messages({
        'any.required': 'O campo categoria é obrigatório.',
        'number.base': 'O campo categoria_id precisa ser informado.',
        'number.empty': 'O campo categoria não pode ser vazio'
    }),
    produto_imagem: joi.string().uri().regex(/\.(jpg|jpeg|png|gif)$/).optional().messages({
        'any.required': 'O campo imagem é obrigatório.',
        'string.empty': 'O campo imagem não pode ser vazio.'
    }),
});




module.exports = schemaProduto