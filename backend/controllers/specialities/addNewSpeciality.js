"use strict";

// Módulo necesario
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");
const {
  addNewSpecialitySchema,
} = require("../../validators/specialityValidators");

async function addNewSpeciality(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idLawyer } = req.params;
    const { speciality } = req.body;

    // Comprobamos el dato que recibimos
    await addNewSpecialitySchema.validateAsync(req.body);

    // Comprobamos que es el abogado que firma la petición
    if (req.auth.id !== Number(idLawyer)) {
      throw generateError(
        `Tienes que ser un abogado registrado, verifica tus datos`,
        401
      );
    }

    // Comprobamos que ese abogado no tenga la especialidad añadida
    const [specialities] = await connection.query(
      `
            SELECT speciality
            FROM specialities
            WHERE id_lawyer=? AND speciality=?
            `,
      [idLawyer, speciality]
    );

    if (specialities.length > 0) {
      throw generateError(
        `Ya tienes la especialidad ${speciality} añadida a tu perfil`,
        400
      );
    }

    // Insertamos la especialidad
    await connection.query(
      `
          INSERT INTO specialities(id_lawyer, speciality)
          VALUES(?, ?)
          `,
      [idLawyer, speciality]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Especialidad añadida correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = addNewSpeciality;
