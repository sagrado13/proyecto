"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { randomString, sendMail, generateError } = require("../../helpers");

const { newUserSchema } = require("../../validators/userValidators");

async function newUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { name, surname, city, login, email, password } = req.body;

    // Comprobamos los datos que se reciben
    await newUserSchema.validateAsync(req.body);

    // Comprobamos que no existe ningún usuario con el mismo login o email en la bbdd
    const [existingUser] = await connection.query(
      `
            SELECT id
            FROM users
            WHERE login_user=? OR email_user=?
            `,
      [login, email]
    );

    if (existingUser.length > 0) {
      throw generateError(`Ya existe un usuario con ese login o email`, 409);
    }

    // Comprobamos que no existe ningún abogado con el mismo nombre, login o email en la bbdd
    const [existingLawyer] = await connection.query(
      `
            SELECT id
            FROM lawyers
            WHERE law_firm=? OR login_lawyer=? OR email_lawyer=?
            `,
      [name, login, email]
    );

    if (existingLawyer.length > 0) {
      throw generateError(
        `Ya existe un abogado con ese name, login o email, si estás registrado como abogado no puedes registrarte como usuario`,
        409
      );
    }

    // Enviamos un mensaje de confirmación de registro al email
    const registrationCode = randomString(30);
    const validationURL = `${process.env.PUBLIC_HOST}/users/validation/${registrationCode}`;

    // Insertamos el nuevo usuario sin activar en la bbdd
    await connection.query(
      `
      INSERT INTO users(name, surname, city_user, login_user, email_user, password, registration_code, creation_date, update_date, last_auth_update)
      VALUES(?, ?, ?, ?, ?, SHA2(?, 512), ?, UTC_TIMESTAMP, UTC_TIMESTAMP, UTC_TIMESTAMP)
      `,
      [name, surname, city, login, email, password, registrationCode]
    );

    // Enviamos email con la url
    try {
      await sendMail({
        email,
        title: `Valida tu cuenta en Legal Shield`,
        content: `Para validar tu cuenta de usuario haz click en el enlace: ${validationURL}`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Usuario registrado correctamente. Activa la cuenta haciendo click en email que te hemos enviado. Mira en la carpeta de SPAM`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;
