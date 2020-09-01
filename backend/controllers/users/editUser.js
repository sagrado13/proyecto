"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { processAndSaveUsersPicture, generateError } = require("../../helpers");

const { editUserSchema } = require("../../validators/userValidators");

async function editUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser } = req.params;
    const { name, surname, city, phoneNumber, login } = req.body;

    // Comprobamos los datos que se reciben
    await editUserSchema.validateAsync(req.body);

    // Comprobamos que el usuario que queremos cambiar es el que firma la petición o es el admin
    if (req.auth.id !== Number(idUser) && req.auth.role !== `admin`) {
      throw generateError(`No puedes editar este usuario`, 403);
    }

    // Comprobamos que el usuario existe
    const [user] = await connection.query(
      `
      SELECT id, name, surname, city_user, phone_number_user, login_user, picture_user
      FROM users
      WHERE id=?
      `,
      [idUser]
    );

    if (user.length === 0) {
      throw generateError(`El usuario con id:${idUser} no existe`, 404);
    }

    // Si el login es distinto al que ya tenía, verificamos que no existe en la bbdd
    if (login !== user[0].login_user) {
      const [existLogin] = await connection.query(
        `
                SELECT id
                FROM users
                WHERE login_user=?
                `,
        [login]
      );

      if (existLogin.length > 0) {
        throw generateError(`Ya existe un usuario con el login ${login}`, 403);
      }
    }

    // Si se recibe phoneNumber y es distinto al que hay en la bbdd verificamos
    // que no existe ningún usuario con ese número
    if (phoneNumber) {
      if (phoneNumber !== user[0].phone_number_user) {
        const [existPhoneNumberUser] = await connection.query(
          `
            SELECT id
            FROM users
            WHERE phone_number_user=?
          `,
          [phoneNumber]
        );

        if (existPhoneNumberUser.length > 0) {
          throw generateError(
            `Ya existe un usuario con el phoneNumber:${phoneNumber}`,
            409
          );
        }
      }
    }

    // Comprobamos que no existe ningún abogado con el mismo nombre, phoneNumber o login en la bbdd
    const [existingLawyer] = await connection.query(
      `
            SELECT id
            FROM lawyers
            WHERE law_firm=? OR phone_number_lawyer=? OR login_lawyer=?
            `,
      [name, phoneNumber, login]
    );

    if (existingLawyer.length > 0) {
      throw generateError(
        `Ya existe un abogado con ese name, phoneNumber o login`,
        409
      );
    }

    // Si nos mandan imagen la procesamos y guardamos
    let savedFileName;
    if (req.files && req.files.avatar) {
      try {
        // Procesamos y gardamos la imagen
        savedFileName = await processAndSaveUsersPicture(req.files.avatar);
      } catch (error) {
        throw generateError(
          `No se puede procesar la imagen, inténtalo de nuevo`,
          400
        );
      }
    } else {
      savedFileName = user[0].picture_user;
    }

    // Actualizamos el usuario en la bbdd
    await connection.query(
      `
        UPDATE users
        SET name=?, surname=?, city_user=?, phone_number_user=?, login_user=?, picture_user=?, update_date=UTC_TIMESTAMP
        WHERE id=?
          `,
      [name, surname, city, phoneNumber, login, savedFileName, idUser]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Usuario actualizado correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editUser;
