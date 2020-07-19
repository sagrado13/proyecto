"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

const {
  resetRecoverCodeLawyerPasswordSchema,
  resetLawyerPasswordSchema,
} = require("../../validators/lawyerValidators");

async function resetLawyerPassword(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { recoverCode } = req.params;
    const { newPassword } = req.body;

    // Comprobamos los datos
    await resetRecoverCodeLawyerPasswordSchema.validateAsync(req.params);
    await resetLawyerPasswordSchema.validateAsync(req.body);

    // Verificamos que hay un abogado con el código de recuperación
    const [lawyer] = await connection.query(
      `
      SELECT id
      FROM lawyers
      WHERE registration_code=? AND active=true
    `,
      [recoverCode]
    );

    if (lawyer.length === 0) {
      throw generateError(
        `No hay ningún abogado con este código de recuperación`,
        404
      );
    }

    // Actualizamos la password y borramos el recoverCode
    await connection.query(
      `
      UPDATE lawyers
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

module.exports = resetLawyerPassword;
