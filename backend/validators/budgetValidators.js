"use strict";

// Módulos necesarios
const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validator generar nuevo presupuesto
const newBudgetSchema = Joi.object().keys({
  message: Joi.string()
    .min(20)
    .required()
    .error(
      generateError(
        `El campo message debe existir y tener mínimo 20 caracteres`,
        400
      )
    ),
  price: Joi.number()
    .min(1)
    .integer()
    .required()
    .error(
      generateError(
        `El campo price debe existir, tener minímo un número y ser entero`
      )
    ),
});

// Validator editar presupuesto por usuario
const editBudgetUserSchema = Joi.object().keys({
  status: Joi.string()
    .lowercase()
    .valid(`aceptado`, `rechazado`)
    .required()
    .error(
      generateError(
        `El campo status debe existir y ser: 'aceptado' o 'rechazado'`,
        400
      )
    ),
});

// Validator editar presupuesto por abogado
const editBudgetLawyerSchema = Joi.object().keys({
  message: Joi.string()
    .min(20)
    .required()
    .error(
      generateError(
        `El campor message debe existir y tener mínimo 20 caracteres`,
        400
      )
    ),
});

// Validator dar puntuación y opinión del proceso resuelto por abogado
const ratingSchema = Joi.object().keys({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .error(
      generateError(
        `El campo rating debe existir y ser un entero de 1 a 5`,
        400
      )
    ),
  opinion: Joi.string()
    .max(250)
    .error(
      generateError(
        `El campo opinion no puede tener más de 250 caracteres`,
        400
      )
    ),
});

module.exports = {
  newBudgetSchema,
  editBudgetUserSchema,
  editBudgetLawyerSchema,
  ratingSchema,
};
