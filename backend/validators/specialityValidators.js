"use strict";

// Módulos necesarios
const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validator para nueva especialidad
const addNewSpecialitySchema = Joi.object().keys({
  speciality: Joi.string()
    .valid(
      `Derecho Civil`,
      `Derecho Penal`,
      `Derecho Comercial`,
      `Derecho Laboral`,
      `Derecho Tributario`,
      `Derecho Constitucional`,
      `Derecho Administrativo`,
      `Derecho Intelectual`,
      `Derecho Ambiental`
    )
    .required()
    .error(
      generateError(
        `El campo speciality debe existir y ser: Derecho Civil, Derecho Penal, Derecho Comercial, Derecho Laboral, Derecho Tributario, Derecho Constitucional, Derecho Administrativo, Derecho Intelectual, Derecho Ambiental.`,
        400
      )
    ),
});

module.exports = {
  addNewSpecialitySchema,
};
