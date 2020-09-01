"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError, sendMail } = require("../../helpers");

const { deleteLawyerSchema } = require("../../validators/lawyerValidators");

async function deleteLawyer(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idLawyer } = req.params;
    const { lowReason } = req.body;

    // Comprobamos que se reciben los datos
    await deleteLawyerSchema.validateAsync(req.body);

    // Desactivamos los datos del abogado en la base de datos y metemos el motivo, solo tiene
    // permiso él y el admin
    if (Number(idLawyer) !== req.auth.id && req.auth.role !== `admin`) {
      throw generateError(
        `Necesitas ser el propio abogado o administrador para borrar los datos`,
        401
      );
    }

    // Comprobamos que existe el abogado en la bbdd
    const [lawyer] = await connection.query(
      `
            SELECT id, email_lawyer
            FROM lawyers
            WHERE id=? AND active=true
            `,
      [idLawyer]
    );

    if (lawyer.length === 0) {
      throw generateError(
        `No existe ningún abogado con el id:${idLawyer}`,
        404
      );
    }
    const email = lawyer[0].email_lawyer;

    // Si tiene procesos aún sin resolver o no es el admin no dejamos borrar el perfil
    const [process] = await connection.query(
      `
      SELECT status_process
      FROM processes
      WHERE id_lawyer=?
      `,
      [idLawyer]
    );

    for (let i = 0; i < process.length; i++) {
      if (
        process[i].status_process !== `resuelto` &&
        req.auth.role !== `admin`
      ) {
        throw generateError(
          `No puedes borrar el perfil si tienes procesos abiertos`,
          403
        );
      }
    }

    // Actualizamos la bbdd con el motivo de baja y marcamos el campo active como false
    await connection.query(
      `
            UPDATE lawyers
            SET low_reason=?, active=false
            WHERE id=?
            `,
      [lowReason, idLawyer]
    );

    // Enviamos email con el motivo de la baja
    try {
      await sendMail({
        email,
        title: `Su cuenta ha sido eliminada de Legal Shield`,
        content: `La cuenta que tenía registrada a sido borrada por:
        ${lowReason}
        `,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `El abogado fue borrado correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteLawyer;
