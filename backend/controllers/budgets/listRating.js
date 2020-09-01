"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function listRating(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idLawyer } = req.params;
    const { order, direction } = req.query;

    // Dirección del orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "ASC" : "DESC";

    // Procesamos el campo order
    let orderBy;
    switch (order) {
      case "rating":
        orderBy = "rating";
        break;
      default:
        orderBy = "update_date";
    }

    // Verificamos que el abogado existe y está activo
    const [lawyer] = await connection.query(
      `
      SELECT L.id, L.law_firm, L.city_lawyer, L.picture_lawyer,
      (SELECT AVG(rating) FROM budgets WHERE id_lawyer=L.id AND rating>0) AS voteAverage,
      (SELECT COUNT(rating) FROM budgets B WHERE B.id_lawyer=L.id) AS total_ratings
      FROM lawyers L
      WHERE id=? AND active=true
      `,
      [idLawyer]
    );

    if (lawyer.length === 0) {
      throw generateError(`El abogado no existe`, 404);
    }

    // Sacamos datos de la puntuación y login de usuario si está activo
    const [ratings] = await connection.query(
      `
          SELECT U.login_user, B.rating, B.opinion, B.update_date
          FROM budgets B
          LEFT JOIN processes P ON B.id_process=P.id
          LEFT JOIN users U ON P.id_user=U.id AND U.active=true
          WHERE B.id_lawyer=? AND B.rating BETWEEN 1 AND 5
          ORDER BY ${orderBy} ${orderDirection}
          `,
      [idLawyer]
    );

    if (ratings.length === 0) {
      throw generateError(
        `El abogado seleccionado todavía no tiene puntuación`,
        404
      );
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      data: {
        ...lawyer[0],
        ratings,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listRating;
