"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

const { searchLawyerSchema } = require("../../validators/lawyerValidators");

async function searchLawyer(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { speciality, city, urgency } = req.body;
    const { order, direction } = req.query;

    // Comprobamos los datos que nos pasan
    await searchLawyerSchema.validateAsync(req.body);

    // Dirección del orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

    // Procesamos el campo order
    let orderBy;
    switch (order) {
      case "voteAverage":
        orderBy = "voteAverage";
        break;
      case "urgency":
        orderBy = "urgency";
        break;
      default:
        orderBy = "city_lawyer";
    }

    // Variable para ordenar
    let ordering = `ORDER BY ${orderBy} ${orderDirection}`;

    // Búsqueda si nos pasan especialidad
    if (speciality) {
      const conditions = [];
      conditions.push(`speciality LIKE '${speciality}'`);
      // Montamos la query según los datos que nos pasan
      let queryWithSpeciality = `SELECT L.id, L.law_firm, L.city_lawyer, L.picture_lawyer, L.urgency, S.speciality,
    (SELECT AVG(rating) FROM budgets WHERE id_lawyer=L.id AND rating>0) AS voteAverage,
    (SELECT COUNT(id_lawyer) FROM budgets WHERE id_lawyer=L.id) AS total_ratings
    FROM lawyers L INNER JOIN specialities S ON L.id=S.id_lawyer`;

      if (city) {
        conditions.push(`city_lawyer LIKE '${city}'`);
      }
      if (urgency) {
        conditions.push(`urgency LIKE '${urgency}'`);
      }

      queryWithSpeciality = `${queryWithSpeciality} WHERE L.active=true AND ${conditions.join(
        ` AND `
      )} ${ordering}`;

      // Extraemos los resultados de la query
      const [resultWithSpeciality] = await connection.query(
        queryWithSpeciality
      );
      if (resultWithSpeciality.length === 0) {
        throw generateError(
          `No hay ningún abogado con la búsqueda realizada`,
          404
        );
      }
      const totalLawyersWithSpeciality = resultWithSpeciality.length;

      // Damos una respuesta
      res.send({
        status: `ok`,
        data: {
          totalLawyersWithSpeciality,
          resultWithSpeciality,
        },
      });
    }

    // Si no recibimos specialidad
    if (!speciality) {
      // Montamos la query según los datos que nos pasan
      let queryWithoutSpeciality = `SELECT L.id, L.law_firm, L.city_lawyer, L.picture_lawyer, L.urgency,
    (SELECT AVG(rating) FROM budgets WHERE id_lawyer=L.id AND rating>0) AS voteAverage,
    (SELECT COUNT(id_lawyer) FROM budgets WHERE id_lawyer=L.id) AS total_ratings
    FROM lawyers L`;

      if (city || urgency) {
        const conditions = [];

        if (city) {
          conditions.push(`city_lawyer LIKE '${city}'`);
        }
        if (urgency) {
          conditions.push(`urgency LIKE '${urgency}'`);
        }

        queryWithoutSpeciality = `${queryWithoutSpeciality} WHERE L.active=true AND ${conditions.join(
          ` AND `
        )} ${ordering}`;
      }

      // Extraemos los resultados de la query
      const [resultWithoutSpeciality] = await connection.query(
        queryWithoutSpeciality
      );

      const totalLawyersWithoutSpeciality = resultWithoutSpeciality.length;

      if (resultWithoutSpeciality.length === 0) {
        throw generateError(
          `No hay ningún abogado con la búsqueda realizada`,
          404
        );
      }

      // Damos una respuesta
      res.send({
        status: `ok`,
        data: {
          totalLawyersWithoutSpeciality,
          resultWithoutSpeciality,
        },
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = searchLawyer;
