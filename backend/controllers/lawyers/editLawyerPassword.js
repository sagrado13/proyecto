"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { randomString, sendMail, generateError } = require("../../helpers");

const {
  editLawyerPasswordSchema,
} = require("../../validators/lawyerValidators");

async function editLawyerPassword(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idLawyer } = req.params;
    const { email, oldPassword, newPassword } = req.body;

    // Comprobamos los datos que se reciben
    await editLawyerPasswordSchema.validateAsync(req.body);

    // Comprobamos que el abogado que quiere cambiar la password es el mismo que está
    // firmando la petición
    if (req.auth.id !== Number(idLawyer)) {
      const errorId = new Error(
        `No puedes cambiar la contraseña de otro abogado`
      );
      errorId.httpStatus = 403;
      throw errorId;
    }

    // Comprobamos que el usuario existe y que la contraseña antigua es la misma
    // que hay en la bbdd
    const [lawyer] = await connection.query(
      `
          SELECT id, email_lawyer
          FROM lawyers
          WHERE id=? AND password=SHA2(?, 512)
          `,
      [idLawyer, oldPassword]
    );
    console.log(lawyer[0].email_lawyer);

    if (lawyer.length === 0) {
      throw generateError(`Tu password antigua no es correcta`, 401);
    }

    // Comprobamos si el email es distinto al que hay en la bbdd, si es distinto
    // miramos que no haya ningún usuario o abogado con el mismo email
    if (email !== lawyer[0].email_lawyer) {
      const [existingLawyer] = await connection.query(
        `
        SELECT id
        FROM lawyers
        WHERE email_lawyer=?
        `,
        [email]
      );

      const [existingUser] = await connection.query(
        `
          SELECT id
          FROM users
          WHERE email_user=? 
        `,
        [email]
      );

      if (existingLawyer.length > 0) {
        throw generateError(`Ya existe un abogado con ese email`, 409);
      }

      if (existingUser.length > 0) {
        throw generateError(`Ya existe un usuario con ese email`, 400);
      }
    }

    // Generamos url para que el abogado se vuelva a validar. Al ya estar registrado
    // ya se puede validar el
    const registrationCode = randomString(30);
    const validationURL = `${process.env.PUBLIC_HOST}/lawyers/validation/${registrationCode}`;

    // Enviamos email de validación
    try {
      await sendMail({
        email,
        title: `Has cambiado el email o contraseña valídate de nuevo `,
        content: `Para validar tu cuenta de abogado en Legal Shield haz click en el enlace: ${validationURL}`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Guardamos el email y la password nueva
    await connection.query(
      `
          UPDATE lawyers
          SET email_lawyer=?, password=SHA2(?, 512), active=false, registration_code=?, update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP
          WHERE id=?
          `,
      [email, newPassword, registrationCode, idLawyer]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Password cambiada correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editLawyerPassword;
