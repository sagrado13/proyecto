"use strict";

// Módulos necesarios
const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validator para nuevo usuario
const newUserSchema = Joi.object().keys({
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
  city: Joi.string()
    .min(2)
    .required()
    .error(
      generateError(
        `El campo city debe existir y tener  mínimo 2 caracteres`,
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
  login: Joi.string().min(3).max(30).required().error(
    generateError(
      `El campo login debe existir y tener entre 3 y 30 caracteres
        `,
      400
    )
  ),
  email: Joi.string()
    .email()
    .required()
    .error(generateError(`El email debe existrir y ser un email válido`, 400)),
  password: Joi.string()
    .alphanum()
    .min(8)
    .required()
    .error(
      generateError(
        `El campo password debe existir y tener mínimo 8 caracteres alfanúmericos`,
        400
      )
    ),
});

// Validator para loguearse con login y contraseña
const loginSchema = Joi.object().keys({
  emailOrLogin: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(
      generateError(
        `El campo emailOrUser debe existir y tener entre 3 y 30 caracteres`,
        400
      )
    ),
  password: Joi.string()
    .alphanum()
    .min(8)
    .required()
    .error(
      generateError(
        `El campo password debe existir y tener mínimo 8 caracteres alfanúmericos`,
        400
      )
    ),
});

// Validator para dar de baja usuario
const deleteUserSchema = Joi.object().keys({
  lowReason: Joi.string()
    .min(10)
    .required()
    .error(
      generateError(
        `El campo lowReason debe existir y tenere más de 10 caracteres`,
        400
      )
    ),
});

// Validator para editar perfil de usuario
const editUserSchema = Joi.object().keys({
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
  city: Joi.string()
    .min(2)
    .required()
    .error(
      generateError(
        `El campo city debe existir y tener  mínimo 2 caracteres`,
        400
      )
    ),
  phoneNumber: Joi.number()
    .integer()
    .error(
      generateError(
        `El campo phoneNumber tiene que ser numérico y no puede llevar espacios,puntos,barras... introduce todo el número junto`,
        400
      )
    ),
  login: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(
      generateError(
        `El campo login debe existir y tener entre 3 y 30 caracteres`,
        400
      )
    ),
});

// Validator para editar contraseña
const editUserPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(generateError(`El email debe existrir y ser un email válido`, 400)),
  oldPassword: Joi.string()
    .alphanum()
    .min(8)
    .required()
    .error(
      generateError(
        `El campo oldPassword debe existir y tener mínimo 8 caracteres alfanúmericos`,
        400
      )
    ),
  newPassword: Joi.string()
    .alphanum()
    .min(8)
    .required()
    .invalid(Joi.ref(`oldPassword`))
    .error(
      generateError(
        `El campo newPassword debe existir, ser diferente a oldPassword y tener mínimo 8 caracteres alfanúmericos`,
        400
      )
    ),
});

// Validator para recuperar contraseña
const recoverUserPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(generateError(`El email debe existrir y ser un email válido`, 400)),
});

// Validator para verificar el que se recibe el código de recuperación y su longitud es la correcta
const resetRecoverCodeUserPasswordSchema = Joi.object().keys({
  recoverCode: Joi.string()
    .length(40)
    .required()
    .error(
      generateError(
        `El campo recoverCode debe existir y tener 40 caracteres`,
        400
      )
    ),
});

// Validator para resetear contraseña
const resetUserPasswordSchema = Joi.object().keys({
  newPassword: Joi.string()
    .alphanum()
    .min(8)
    .required()
    .error(
      generateError(
        `El campo newPassword debe existir y tener mínimo 8 caracteres alfanúmericos`,
        400
      )
    ),
});

module.exports = {
  newUserSchema,
  loginSchema,
  deleteUserSchema,
  editUserSchema,
  editUserPasswordSchema,
  recoverUserPasswordSchema,
  resetRecoverCodeUserPasswordSchema,
  resetUserPasswordSchema,
};
