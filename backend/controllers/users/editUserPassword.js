"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { randomString, sendMail, generateError } = require("../../helpers");

const { editUserPasswordSchema } = require("../../validators/userValidators");

async function editUserPassword(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser } = req.params;
    const { email, oldPassword, newPassword } = req.body;

    // Comprobamos los datos que se reciben
    await editUserPasswordSchema.validateAsync(req.body);

    // Comprobamos que el usuario que quiere cambiar la password es el mismo que está firmando la petición
    if (req.auth.id !== Number(idUser)) {
      throw generateError(
        `No puedes cambiar la contraseña de otro usuario`,
        403
      );
    }

    // Comprobamos que el usuario existe y que la contraseña antigua es la misma que hay en la bbdd
    const [user] = await connection.query(
      `
          SELECT id, email_user
          FROM users
          WHERE id=? AND password=SHA2(?, 512)
          `,
      [idUser, oldPassword]
    );

    if (user.length === 0) {
      throw generateError(`Tu password antigua no es correcta`, 401);
    }

    // Comprobamos si el email es distinto al que hay en la bbdd, si es distinto
    // miramos que no haya ningún usuario o abogado con el mismo email
    if (email !== user[0].email_user) {
      const [existingUser] = await connection.query(
        `
        SELECT id
        FROM users
        WHERE email_user=? 
      `,
        [email]
      );

      const [existingLawyer] = await connection.query(
        `
            SELECT id
            FROM lawyers
            WHERE email_lawyer=?
            `,
        [email]
      );

      if (existingLawyer.length > 0) {
        throw generateError(`Ya existe un abogado con ese email`, 409);
      }

      if (existingUser.length > 0) {
        throw generateError(`Ya existe un usuario con ese email`, 409);
      }
    }

    // Generamos una url para validar el cambio de la password
    const registrationCode = randomString(30);
    const validationURL = `${process.env.PUBLIC_HOST}/users/validation/${registrationCode}`;

    // Enviamos email de validación
    try {
      await sendMail({
        email,
        title: `Has cambiado el email, valídalo de nuevo `,
        content: `Para validar tu cuenta de usuario en Legal Shield haz click en el enlace: ${validationURL}`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Guardamos la password nueva y el email
    await connection.query(
      `
      UPDATE users
      SET email_user=?, password=SHA2(?, 512), active=false, registration_code=?, update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP
      WHERE id=?
      `,
      [email, newPassword, registrationCode, idUser]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Cambios realizados correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editUserPassword;
