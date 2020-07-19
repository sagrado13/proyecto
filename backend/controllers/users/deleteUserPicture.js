"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError, deleteUserUpload } = require("../../helpers");

async function deleteUserPicture(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idUser } = req.params;

    // Comprobamos que el usuario que quiere borrar la imagen es el que firma la petición
    if (req.auth.id !== Number(idUser) && req.auth.role !== `admin`) {
      throw generateError(`No puedes borrar la imagen de otro usuario`, 401);
    }

    // Comprobamos si existe la imagen
    const [userPicture] = await connection.query(
      `
      SELECT picture_user
      FROM users
      WHERE id=?
    `,
      [idUser]
    );

    if (userPicture[0].picture_lawyer === null) {
      throw generateError(`La imagen no existe`, 404);
    }

    // Borrar la imagen de la bbdd y de la carpeta donde se guardan
    await connection.query(
      `
      UPDATE users
      SET picture_user=null
      WHERE id=?
    `,
      [idUser]
    );

    await deleteUserUpload(userPicture[0].picture_user);

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

module.exports = deleteUserPicture;
