"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const jsonwebtoken = require("jsonwebtoken");
const { generateError } = require("../../helpers");

const { loginSchema } = require("../../validators/lawyerValidators");

async function loginLawyer(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { emailOrLogin, password } = req.body;
    // Comprobamos los datos que se reciben
    await loginSchema.validateAsync(req.body);

    // Miramos si existe un abogado con el login o email y la contraseña y está activo
    const [lawyer] = await connection.query(
      `
            SELECT id, law_firm, picture_lawyer, active, update_date
            FROM lawyers
            WHERE login_lawyer=? AND password=SHA2(?, 512) OR email_lawyer=? AND password=SHA2(?, 512)
            `,
      [emailOrLogin, password, emailOrLogin, password]
    );

    if (lawyer.length === 0) {
      throw generateError(
        `No hay ningún abogado con los datos introducidos, revisa que sean correctos`,
        400
      );
    } else if (!lawyer[0].active) {
      throw generateError(
        `El abogado está registrado pero no activado. Por favor revisa tu email y activalo`,
        400
      );
    }

    // Generamos un token
    const tokenInfo = {
      id: lawyer[0].id,
    };

    const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
      expiresIn: `30d`,
    });

    // Actualizamos update_date con la fecha del login
    await connection.query(
      `
          UPDATE lawyers
          SET update_date=UTC_TIMESTAMP
          WHERE id=?
          `,
      [lawyer[0].id]
    );

    // Devolvemos una respuesta con el token
    res.send({
      status: `ok`,
      data: {
        lawyer,
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginLawyer;
