"use strict";

// Módulos necesarios
const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validator formulario de contacto
const contactSchema = Joi.object().keys({
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .error(
      generateError(
        `El campo name debe existir y tener entre 2 y 30 caracteres`,
        400
      )
    ),
  surname: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        `El campo surname debe existir y tener mínimo 8 caracteres`,
        400
      )
    ),
  phoneNumber: Joi.number()
    .required()
    .integer()
    .error(
      generateError(
        `El campo phoneNumber tiene que existir, ser numérico y no puede llevar espacios,puntos,barras... introduce todo el número junto`,
        400
      )
    ),
  emailUser: Joi.string()
    .email()
    .required()
    .error(generateError(`El email debe existrir y ser un email válido`, 400)),
  message: Joi.string()
    .alphanum()
    .min(15)
    .required()
    .error(
      generateError(
        `El campo message debe existir y tener mínimo 15 caracteres alfanúmericos`,
        400
      )
    ),
});

module.exports = {
  contactSchema,
};
