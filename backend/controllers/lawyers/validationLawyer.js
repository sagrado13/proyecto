"use strict";

// Módulo necesario
const { getConnection } = require("../../bbdd");
const { sendMail, generateError } = require("../../helpers");

async function validationLawyer(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { registrationCode } = req.params;

    // Comprobamos que el registationCode que le pasamos es el mismo que tenemos en la bbdd
    const [lawyer] = await connection.query(
      `
            SELECT email_lawyer
            FROM lawyers
            WHERE registration_code=?
            `,
      [registrationCode]
    );

    if (lawyer.length === 0) {
      throw generateError(
        `No hay ningún abogado pendiente de validación con el código introducido`,
        404
      );
    }

    const email = lawyer[0].email_lawyer;

    // Si hay un abogado pendiente de activación con el código de activación,
    // actualizamos la bbdd, lo marcamos como activo y registration_code lo dejamos NULL
    await connection.query(
      `
            UPDATE lawyers
            SET active=true, registration_code=NULL
            WHERE registration_code=?
            `,
      [registrationCode]
    );

    // Enviamos email al abogado avisándolo de que ha sido aceptado
    try {
      await sendMail({
        email,
        title: `Enhorabuena has sido validado en Legal Shield`,
        content: `Ya puedes hacer login cuando quieras.`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Cuenta validada correctamente, se ha enviado un email al abogado para avisarlo de que ha sido aceptado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = validationLawyer;
