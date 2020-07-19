"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { randomString, sendMail, generateError } = require("../../helpers");

const {
  recoverLawyerPasswordSchema,
} = require("../../validators/lawyerValidators");

async function recoverLawyerPassword(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { email } = req.body;

    // Comprobamos el email
    await recoverLawyerPasswordSchema.validateAsync(req.body);

    // Verificamos que existe un abogado con el email y está activo
    const [lawyer] = await connection.query(
      `
      SELECT id
      FROM lawyers
      WHERE email_lawyer=? AND active=true
    `,
      [email]
    );

    if (lawyer.length === 0) {
      throw generateError(`No hay ningún abogado con el email:${email}`, 404);
    }

    // Insertamos un código aleatorio en la url que se le enviará al email del abogado
    const recoverCode = randomString(40);
    const recoverURL = `${process.env.PUBLIC_HOST}/lawyers/reset-password/${recoverCode}`;

    await connection.query(
      `
      UPDATE lawyers
      SET registration_code=?
      WHERE email_lawyer=?
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

module.exports = recoverLawyerPassword;
