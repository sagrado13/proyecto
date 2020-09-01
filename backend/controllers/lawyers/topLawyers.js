"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function topLawyers(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const [lawyers] = await connection.query(
      `
      SELECT L.id, L.law_firm, L.city_lawyer, L.picture_lawyer, L.description, L.creation_date, L.update_date,
      (SELECT AVG(rating) FROM budgets WHERE id_lawyer=L.id AND rating>0) AS voteAverage, 
      (SELECT COUNT(rating) FROM budgets WHERE id_lawyer=L.id) AS total_ratings
      FROM lawyers L
      WHERE active=true
      ORDER BY voteAverage DESC LIMIT 5
      `
    );

    // Si no hay ningún abogado lanzamos un error
    if (lawyers.length === 0) {
      throw generateError(`No hay ningún abogado`, 404);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      data: lawyers,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = topLawyers;
