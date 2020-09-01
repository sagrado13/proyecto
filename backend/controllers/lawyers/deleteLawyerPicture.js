"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError, deleteLawyerUpload } = require("../../helpers");

async function deleteLawyerPicture(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idLawyer } = req.params;

    // Comprobamos que el abogado que quiere borrar la imagen es el que firma la petición
    if (req.auth.id !== Number(idLawyer) && req.auth.role !== `admin`) {
      throw generateError(`No puedes borrar la imagen de otro abogado`, 401);
    }

    // Comprobamos si existe la imagen
    const [lawyerPicture] = await connection.query(
      `
      SELECT picture_lawyer
      FROM lawyers
      WHERE id=?
    `,
      [idLawyer]
    );

    if (lawyerPicture[0].picture_lawyer === null) {
      throw generateError(`La imagen no existe`, 404);
    }

    // Borrar la imagen de la bbdd y de la carpeta donde está guardada
    await connection.query(
      `
      UPDATE lawyers
      SET picture_lawyer=null
      WHERE id=?
    `,
      [idLawyer]
    );

    await deleteLawyerUpload(lawyerPicture[0].picture_lawyer);

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Imagen borrada correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteLawyerPicture;
