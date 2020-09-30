"use strict";

// Módulo necesario
const { getConnection } = require("../../bbdd");
const { sendMail, generateError } = require("../../helpers");

async function reactivateLawyer(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idLawyer } = req.params;

    if (req.auth.role !== `admin`) {
      throw generateError(
        `No puedes reactivar abogados si no eres el admin`,
        403
      );
    }

    // Comprobamos que el idLawyer que nos pasan es el mismo que tenemos en la bbdd
    // y sacamos el email para mandarle una confirmación
    const [result] = await connection.query(
      `
            SELECT email_lawyer
            FROM lawyers
            WHERE id=? AND active=false
            `,
      [idLawyer]
    );

    if (result.length === 0) {
      throw generateError(
        `No hay ningún abogado con esa id para reactivar`,
        404
      );
    }

    const email = result[0].email_lawyer;
    // Si hay un usuario para reactiva actualizamos la bbdd borrando el registration_code si existe
    //y marcamos como activo el campo active
    await connection.query(
      `
            UPDATE lawyers
            SET low_reason=NULL ,active=true, registration_code=NULL
            WHERE id=?
            `,
      [idLawyer]
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
      message: `Cuenta reactivada, se le ha enviado un email de confirmación al abogado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = reactivateLawyer;
