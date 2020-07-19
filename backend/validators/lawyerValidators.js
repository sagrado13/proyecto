"use strict";

// Módulos necesarios
const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validator nuevo abogado
const newLawyerSchema = Joi.object().keys({
  lawFirm: Joi.string()
    .min(5)
    .max(50)
    .required()
    .error(
      generateError(
        `El campo lawFirm debe existir y tener entre 5 y 50 caracteres`,
        400
      )
    ),
  street: Joi.string()
    .required()
    .error(generateError(`El campo street debe existir`, 400)),
  zip: Joi.string()
    .min(4)
    .required()
    .error(
      generateError(`El campo zip debe existir y tener  mínimo 4 dígitos`, 400)
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
  login: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .error(
      generateError(
        `El campo login debe existir y tener entre 3 y 30 caracteres alfanúmericos `,
        400
      )
    ),
  emailLawyer: Joi.string()
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
const loginLawyerSchema = Joi.object().keys({
  login: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .error(
      generateError(
        `El campo login debe existir y tener entre 3 y 30 caracteres alfanúmericos `,
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

// Validator para loguearse con email y contraseña
const loginEmailLawyerSchema = Joi.object().keys({
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

// Validator para dar de baja abogado
const deleteLawyerSchema = Joi.object().keys({
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

// Validator para editar perfil del abogado
const editLawyerSchema = Joi.object().keys({
  lawFirm: Joi.string()
    .min(5)
    .max(50)
    .required()
    .error(
      generateError(
        `El campo lawFirm debe existir y tener entre 5 y 50 caracteres`,
        400
      )
    ),
  street: Joi.string()
    .required()
    .error(generateError(`El campo street debe existir`, 400)),
  zip: Joi.string()
    .min(4)
    .required()
    .error(
      generateError(`El campo zip debe existir y tener  mínimo 4 dígitos`, 400)
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
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .error(
      generateError(
        `El campo login debe existir y tener entre 3 y 30 caracteres alfanúmericos `,
        400
      )
    ),
  description: Joi.string()
    .min(20)
    .error(
      generateError(
        `El campo description debe tener un mínimo de 20 caracteres`,
        400
      )
    ),
  urgency: Joi.string()
    .valid(`alta`, `media`, `baja`)
    .lowercase()
    .required()
    .error(
      generateError(
        `El campo urgency debe existir y ser: 'alta', 'media', 'baja'`,
        400
      )
    ),
});

// Validator para editar contraseña
const editLawyerPasswordSchema = Joi.object().keys({
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
const recoverLawyerPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(generateError(`El email debe existrir y ser un email válido`, 400)),
});

// Validator para verificar el que se recibe el código de recuperación y su longitud es la correcta
const resetRecoverCodeLawyerPasswordSchema = Joi.object().keys({
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
const resetLawyerPasswordSchema = Joi.object().keys({
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

// Validator búsqueda de abogados
const searchLawyerSchema = Joi.object().keys({
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
    .error(
      generateError(
        `El campo speciality debe ser: Derecho Civil, Derecho Penal, Derecho Comercial, Derecho Laboral, Derecho Tributario, Derecho Constitucional, Derecho Administrativo, Derecho Intelectual, Derecho Ambiental.`,
        400
      )
    ),
  city: Joi.string()
    .min(2)
    .error(generateError(`El campo city debe tener  mínimo 2 caracteres`, 400)),
  urgency: Joi.string()
    .valid(`alta`, `media`, `baja`)
    .lowercase()
    .error(
      generateError(`El campo urgency debe ser: 'alta', 'media', 'baja'`, 400)
    ),
});

module.exports = {
  newLawyerSchema,
  loginLawyerSchema,
  loginEmailLawyerSchema,
  deleteLawyerSchema,
  editLawyerSchema,
  editLawyerPasswordSchema,
  recoverLawyerPasswordSchema,
  resetRecoverCodeLawyerPasswordSchema,
  resetLawyerPasswordSchema,
  searchLawyerSchema,
};
