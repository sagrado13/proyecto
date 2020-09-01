"use strict";

// Módulos necesarios
const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validator abrir proceso
const newProcessSchema = Joi.object().keys({
  message: Joi.string()
    .min(40)
    .required()
    .error(
      generateError(
        `El campo message tiene que existir y tener mínimo 40 caracteres`,
        400
      )
    ),
});

// Validator editar proceso por usuario
const editProcessUserSchema = Joi.object().keys({
  observations: Joi.string()
    .min(10)
    .max(300)
    .required()
    .error(
      generateError(
        `El campo observations debe existir y tener entre 10 y 300 caracteres`,
        400
      )
    ),
});

module.exports = {
  newProcessSchema,
  editProcessUserSchema,
};
