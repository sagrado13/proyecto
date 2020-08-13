"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { sendMail, generateError } = require("../../helpers");
const { newProcessSchema } = require("../../validators/processValidators");

async function newProcess(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser, idLawyer } = req.params;
    const { message } = req.body;

    // Comprobamos los datos
    await newProcessSchema.validateAsync(req.body);

    // Comprobamos que el usuario es el que firma la petición
    if (req.auth.id !== Number(idUser)) {
      const errorIdUser = new Error(
        `No puedes abrir un proceso para otro usuario`
      );
      errorIdUser.httpStatus = 401;
      throw errorIdUser;
    }

    // Cogemos el email del abogado para enviarle una copia
    const [lawyer] = await connection.query(
      `
            SELECT law_firm, email_lawyer
            FROM lawyers
            WHERE id=?
            `,
      [idLawyer]
    );

    if (lawyer.length === 0) {
      throw generateError(`No existe nigún abogado con la id:${idLawyer}`, 404);
    }

    const email = lawyer[0].email_lawyer;

    // Insertamos el nuevo proceso en la bbdd
    await connection.query(
      `
      INSERT INTO processes(message_process, id_user, id_lawyer, creation_date, update_date)
      VALUES(?, ?, ?, UTC_TIMESTAMP, UTC_TIMESTAMP)
      `,
      [message, idUser, idLawyer]
    );

    // Enviamos email al abogado con el mensaje del usuario
    try {
      await sendMail({
        email,
        title: `Proceso nuevo abierto`,
        content: `${message}`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Proceso abierto, se ha enviado una copia por correo a ${lawyer[0].law_firm}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newProcess;
