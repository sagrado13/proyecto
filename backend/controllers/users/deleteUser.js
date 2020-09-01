"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError, sendMail } = require("../../helpers");

const { deleteUserSchema } = require("../../validators/userValidators");

async function deleteUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idUser } = req.params;
    const { lowReason } = req.body;

    // Comprobamos que se reciben los datos
    await deleteUserSchema.validateAsync(req.body);

    if (Number(idUser) !== req.auth.id && req.auth.role !== `admin`) {
      // Desactivamos los datos del usuario en la base de datos y metemos el motivo, solo si es el que
      // firma la petición o el admin
      throw generateError(
        `Necesitas ser el propio usuario o administrador para borrar el usuario con id:${idUser}`,
        401
      );
    }

    // Comprobamos que existe el usuario en la bbdd y está activo
    const [user] = await connection.query(
      `
            SELECT id, email_user
            FROM users
            WHERE id=? AND active=true
            `,
      [idUser]
    );
    if (user.length === 0) {
      throw generateError(`No existe ningún usuario con el id:${idUser}`, 404);
    }

    const email = user[0].email_user;

    // Si tiene procesos aún sin resolver o no es el admin no dejamos borrar el perfil
    const [process] = await connection.query(
      `
      SELECT status_process
      FROM processes
      WHERE id_user=?
      `,
      [idUser]
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
            UPDATE users
            SET low_reason=?, active=false
            WHERE id=?
            `,
      [lowReason, idUser]
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
      message: `El usuario con id:${idUser} fue borrado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteUser;
