"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

const {
  resetRecoverCodeUserPasswordSchema,
  resetUserPasswordSchema,
} = require("../../validators/userValidators");

async function resetUserPassword(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { recoverCode } = req.params;
    const { newPassword } = req.body;
    // Comprobamos los datos
    await resetRecoverCodeUserPasswordSchema.validateAsync(req.params);
    await resetUserPasswordSchema.validateAsync(req.body);

    // Verificamos que hay un usuario con el código de recuperación y está activo
    const [user] = await connection.query(
      `
      SELECT id
      FROM users
      WHERE registration_code=? AND active=true
    `,
      [recoverCode]
    );

    if (user.length === 0) {
      throw generateError(
        `No hay ningún usuario con este código de recuperación`,
        404
      );
    }

    // Actualizamos la password
    await connection.query(
      `
      UPDATE users
      SET password=SHA2(?, 512), registration_code=NULL, update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP
      WHERE registration_code=?
    `,
      [newPassword, recoverCode]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Password recuperada correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = resetUserPassword;
