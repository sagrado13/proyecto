"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function listDeletedUsers(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { order, direction } = req.query;

    // Dirección del orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

    // Proceso campo orden
    let orderBy;
    switch (order) {
      case "email":
        orderBy = "email_user";
        break;
      case "city":
        orderBy = "city_user";
        break;
      case "login":
        orderBy = "login_user";
        break;
      case "updateDate":
        orderBy = "update_date";
        break;
      default:
        orderBy = "name";
    }

    const [users] = await connection.query(
      `
      SELECT id, name, surname, city_user, phone_number_user, login_user, email_user, 
      picture_user, low_reason, registration_code, creation_date, update_date
      FROM users
      WHERE active=false
      ORDER BY ${orderBy} ${orderDirection}
      `
    );

    // Si no hay ningún usuario dado de baja lanzamos un error
    if (users.length === 0) {
      throw generateError(`No hay ningún usuario dado de baja`, 404);
    }

    // Contamos el número total de usuarios dados de baja
    const [totalUsers] = await connection.query(
      `
        SELECT COUNT(id) AS total_users
        FROM users
        WHERE active=false
        `
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      data: totalUsers,
      users,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listDeletedUsers;
