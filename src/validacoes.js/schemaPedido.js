const joi = require('joi')

const schemaPedido = joi.object({
  cliente_id: joi.number().required().messages({
    'number.empty': 'O campo cliente_id é obrigatório',
    'any.required': 'O campo cliente_id é obrigatório',
    'number.base': 'Informe um cliente_id válido.'
  }),
  observacao: joi.string().allow('').messages({
    'any.required': 'O campo observacao é obrigatório.',
    'string.empty': 'O campo observacao é obrigatório.',
    'string.base': 'Informe uma observacao válida.'

  }),
  pedido_produtos: joi.array().items(joi.object().keys({
    produto_id: joi.number().required().messages({
      'any.required': 'O campo produto_id é obrigatório.',
      'number.empty': 'O campo produto_id precisa ser preenchido',
      'number.base': 'O campo produto_id deve ser um numero'
    }),
    quantidade_produto: joi.number().required().messages({
      'any.required': 'O campo quantidade_produto é obrigatório.',
      'number.empty': 'O campo quantidade_produto precisa ser preenchido',
      'number.base': 'O campo quantidade_produto deve ser um numero'
    })
  }))
});

module.exports = schemaPedido