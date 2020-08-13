"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function getUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser } = req.params;

    // Verificamos que existe un usuario con esa id y que está activo
    const [user] = await connection.query(
      `
      SELECT id, name, surname, city_user, phone_number_user, login_user, email_user, picture_user, creation_date
      FROM users
      WHERE id=? AND active=true
      `,
      [idUser]
    );

    if (user.length === 0) {
      throw generateError(`El usuario con id:${idUser} no existe`, 404);
    }

    const [userData] = user;

    const responseData = {
      login: userData.login_user,
      picture: userData.picture_user,
    };

    // Si es el propio usuario o admin mostramos más datos
    if (userData.id === req.auth.id || req.auth.role === `admin`) {
      responseData.id = userData.id;
      responseData.name = userData.name;
      responseData.surname = userData.surname;
      responseData.city = userData.city_user;
      responseData.phoneNumber = userData.phone_number_user;
      responseData.email = userData.email_user;
      responseData.creationDate = userData.creation_date;
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      data: responseData,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getUser;
