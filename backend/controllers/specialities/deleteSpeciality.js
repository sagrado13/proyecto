"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function deleteSpeciality(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idLawyer, idSpeciality } = req.params;

    // Comprobamos que es el abogado que firma la petición
    if (Number(idLawyer) !== req.auth.id && req.auth.role !== `admin`) {
      throw generateError(
        `Tienes que ser el abogado que hace la petición`,
        401
      );
    }

    // Comprobamos que la especialidad existe
    const [speciality] = await connection.query(
      `
            SELECT id
            FROM specialities
            WHERE id=? AND id_lawyer=?
            `,
      [idSpeciality, idLawyer]
    );

    if (speciality.length === 0) {
      throw generateError(
        `No existe la especialidad con el id:${idSpeciality} para el abogado con id:${idLawyer}`,
        404
      );
    }

    // Borramos la especialidad seleccionada
    await connection.query(
      `
        DELETE FROM specialities
        WHERE id=? AND id_lawyer=?
        `,
      [idSpeciality, idLawyer]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `La especialidad con id:${idSpeciality} ha sido borrada`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteSpeciality;
