"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { randomString, sendMail, generateError } = require("../../helpers");

const {
  recoverUserPasswordSchema,
} = require("../../validators/userValidators");

async function recoverUserPassword(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { email } = req.body;

    // Comprobamos el email que se recibe
    await recoverUserPasswordSchema.validateAsync(req.body);

    // Verificamos que existe un usuario con el email y está activo
    const [user] = await connection.query(
      `
      SELECT id
      FROM users
      WHERE email_user=? AND active=true
    `,
      [email]
    );

    if (user.length === 0) {
      throw generateError(`No hay ningún usuario con el email:${email}`, 404);
    }

    // Insertamos un código aleatorio en la url que se enviara por email para resetear la password
    const recoverCode = randomString(40);
    const recoverURL = `${process.env.FRONTEND_HOST}/users/reset-password/${recoverCode}`;

    await connection.query(
      `
      UPDATE users
      SET registration_code=?
      WHERE email_user=?
    `,
      [recoverCode, email]
    );

    // Enviamos email
    try {
      await sendMail({
        email: email,
        title: `Enlace de reseteo de password`,
        content: `Has solicitado la recuperación de la contraseña, este es el enlace para introducir tu nueva constraseña: 
        ${recoverURL}
          
        Si no solicitaste esta recuperación ignora el correo.
        `,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Se envió un email con las instrucciones para recuperar la contraseña`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = recoverUserPassword;
