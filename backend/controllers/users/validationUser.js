"use strict";

// Módulo necesario
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function validationUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { registrationCode } = req.params;

    // Comprobamos que el registationCode que nos pasan es el mismo que tenemos en la bbdd
    const [result] = await connection.query(
      `
            SELECT email_user
            FROM users
            WHERE registration_code=?
            `,
      [registrationCode]
    );

    if (result.length === 0) {
      throw generateError(
        `No hay ningún usuario pendiente de validación con el código introducido`,
        404
      );
    }

    // Si hay un usuario pendiente de activación con el código de activación,
    // actualizamos la bbdd borrando el registration_code y marcamos como activo el campo active
    await connection.query(
      `
            UPDATE users
            SET active=true, registration_code=NULL
            WHERE registration_code=?
            `,
      [registrationCode]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Ya puedes hacer login con tu email: ${result[0].email_user} y tu contraseña`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = validationUser;
