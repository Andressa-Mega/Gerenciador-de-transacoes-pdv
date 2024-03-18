const joi = require('joi')

const schemaCliente = joi.object({
    nome: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório'
    }),
    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório'
    }),
    cpf: joi.string().pattern(/^[0-9]{11}$/).required().messages({
        'any.required': 'O campo cpf é obrigatório.',
        'string.empty': 'O campo cpf é obrigatório.',
        'string.pattern.base': 'Informe um cpf válido.',
        'string.base': 'Informe um cpf válido.'

    }),
    cep: joi.string().pattern(new RegExp('^[0-9]{8}$')).messages({
        'string.pattern.base': 'Informe um cep válido.',
        'string.base': 'Informe um cep válido.',
        'string.empty': 'Informe um cep válido.'
    }),
    rua: joi.string().trim().max(140).messages({
        'string.base': 'Informe uma rua válida.',
        'string.empty': 'Informe uma rua válida.',
        'string.max': 'Informe uma rua válida.'
    }),
    numero: joi.string().max(5).pattern(new RegExp(/^\d+[a-zA-Z]*$/)).messages({
        'string.base': 'Informe um numero válido.',
        'string.empty': 'Informe um numero válido.',
        'string.max': 'Informe um numero válido.',
        "string.pattern.base": 'Informe um numero válido.'

    }),
    bairro: joi.string().trim().max(140).messages({
        'string.base': 'Informe um bairro válido.',
        'string.empty': 'Informe um bairro válido.',
        'string.max': 'Informe um bairro válido.'
    }),
    cidade: joi.string().trim().max(140).messages({
        'string.base': 'Informe uma cidade válida.',
        'string.empty': 'Informe uma cidade válida.',
        'string.max': 'Informe uma cidade válida.'
    }),
    estado: joi.string().trim().max(2).messages({
        'string.base': 'Informe um estado válido.',
        'string.empty': 'Informe um estado válido.',
        'string.max': 'Informe um estado válido.'
    })

});


module.exports = schemaCliente;