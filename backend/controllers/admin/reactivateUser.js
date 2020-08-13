"use strict";

// Módulo necesario
const { getConnection } = require("../../bbdd");
const { sendMail, generateError } = require("../../helpers");

async function reactivateUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idUser } = req.params;

    // Comprobamos que el idUser que nos pasan es el mismo que tenemos en la bbdd
    // y sacamos el email para mandarle una confirmación
    const [result] = await connection.query(
      `
            SELECT email_user
            FROM users
            WHERE id=? AND active=false
            `,
      [idUser]
    );
    console.log(result);
    if (result.length === 0) {
      throw generateError(
        `No hay ningún usuario con esa id para reactivar`,
        404
      );
    }

    const email = result[0].email_user;
    // Si hay un usuario para reactiva actualizamos la bbdd borrando el registration_code si existe
    //y marcamos como activo el campo active
    await connection.query(
      `
            UPDATE users
            SET active=true, registration_code=NULL
            WHERE id=?
            `,
      [idUser]
    );

    // Enviamos email con la url
    try {
      await sendMail({
        email,
        title: `Enhorabuena, cuenta recuperada`,
        content: `Siguiendo tus intrucciones hemos revisado tus datos y hemos recuperado tu cuenta. Ya puedes hacer login cuando quieras`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Cuenta reactivada, se le ha enviado un email de confirmación al usuario`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = reactivateUser;
