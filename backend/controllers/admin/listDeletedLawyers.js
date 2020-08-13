"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function listDeletedLawyers(req, res, next) {
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
        orderBy = "email_lawyer";
        break;
      case "city":
        orderBy = "city_lawyer";
        break;
      case "login":
        orderBy = "login_lawyer";
        break;
      case "updateDate":
        orderBy = "update_date";
        break;
      default:
        orderBy = "law_firm";
    }

    const [lawyers] = await connection.query(
      `
      SELECT id, law_firm, street, zip, city_lawyer, phone_number_lawyer, login_lawyer, 
      email_lawyer, picture_lawyer, description, low_reason, registration_code, 
      creation_date, update_date
      FROM lawyers
      WHERE active=false
      ORDER BY ${orderBy} ${orderDirection}
      `
    );

    // Si no hay ningún abogado dado de baja lanzamos un error
    if (lawyers.length === 0) {
      throw generateError(`No hay ningún abogado dado de baja`, 404);
    }

    // Contamos el número total de abogados dados de baja
    const [totalLawyers] = await connection.query(
      `
        SELECT COUNT(id) AS total_lawyers
        FROM lawyers
        WHERE active=false
        `
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      data: totalLawyers,
      lawyers,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listDeletedLawyers;
