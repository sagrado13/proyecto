"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { randomString, sendMail, generateError } = require("../../helpers");

const { newLawyerSchema } = require("../../validators/lawyerValidators");

async function newLawyer(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const {
      lawFirm,
      street,
      zip,
      city,
      login,
      emailLawyer,
      password,
    } = req.body;

    // Comprobamos los datos
    await newLawyerSchema.validateAsync(req.body);

    // Comprobamos que no existe ningún abogado con el mismo lawFirm, login o email en la bbdd
    const [existingLawyer] = await connection.query(
      `
            SELECT id
            FROM lawyers
            WHERE law_firm=? OR login_lawyer=? OR email_lawyer=?
            `,
      [lawFirm, login, emailLawyer]
    );

    if (existingLawyer.length > 0) {
      throw generateError(
        `Ya existe un abogado con ese nombre, login o email`,
        409
      );
    }

    // Comprobamos que no existe ningún usuario con el mismo login o email en la bbdd
    const [existingUser] = await connection.query(
      `
      SELECT id
      FROM users
      WHERE login_user=? OR email_user=?
      `,
      [login, emailLawyer]
    );

    if (existingUser.length > 0) {
      throw generateError(
        `Ya existe un usuario con ese login o email, si estás registrado como usuario no puedes registrarte como abogado`,
        409
      );
    }

    // Cogemos email de admin para que valide al abogado
    const [admin] = await connection.query(
      `
      SELECT email_user
      FROM users
      WHERE role='admin'
      `
    );

    const email = admin[0].email_user;

    // Enviamos un email de confirmación de registro al email del admin
    const registrationCode = randomString(30);
    const validationURL = `${process.env.PUBLIC_HOST}/lawyers/validation/${registrationCode}`;

    try {
      await sendMail({
        email,
        title: `Abogado nuevo registrado  en Legal Shield`,
        content: `${lawFirm} en ${street}, ${zip} de ${city} quiere registrarse con el Login: ${login} y email: ${emailLawyer}.
        Verifica su veracidad y si procede, valida su cuenta con el siguiente enlace:
        
        ${validationURL}`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Insentamos el nuevo abogado sin activar en la bbdd
    await connection.query(
      `
      INSERT INTO lawyers(law_firm, street, zip, city_lawyer, login_lawyer, email_lawyer, password, registration_code, creation_date, update_date, last_auth_update)
      VALUES(?, ?, ?, ?, ?, ?, SHA2(?, 512), ?, UTC_TIMESTAMP, UTC_TIMESTAMP, UTC_TIMESTAMP)
      `,
      [
        lawFirm,
        street,
        zip,
        city,
        login,
        emailLawyer,
        password,
        registrationCode,
      ]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Abogado registrado correctamente. Espera a ser validado por el admin`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newLawyer;
