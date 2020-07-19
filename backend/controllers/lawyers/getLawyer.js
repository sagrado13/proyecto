"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function getLawyer(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idLawyer } = req.params;

    // Miramos si existe el abogado en la bbdd
    const [lawyer] = await connection.query(
      `
      SELECT L.id, L.law_firm, L.street, L.zip, L.city_lawyer, L.phone_number_lawyer, L.login_lawyer, 
      L.email_lawyer, L.picture_lawyer, L.description, L.urgency, L.creation_date, (SELECT AVG(rating) 
      FROM budgets WHERE id_lawyer=L.id AND rating>0) AS voteAverage, (SELECT COUNT(rating) 
      FROM budgets WHERE id_lawyer=L.id) AS total_ratings
      FROM lawyers L
      WHERE L.id=? AND active=true
      `,
      [idLawyer]
    );

    if (lawyer.length === 0) {
      throw generateError(`El abogado con id:${idLawyer} no existe`, 404);
    }
    const [specialities] = await connection.query(
      `
      SELECT speciality
      FROM specialities
      WHERE id_lawyer=?
      `,
      [idLawyer]
    );

    const [lawyerData] = lawyer;

    const responseData = {
      login: lawyerData.login_lawyer,
      picture: lawyerData.picture_lawyer,
    };

    // Si es el propio abogado o admin mostramos más datos
    if (lawyerData.id === req.auth.id || req.auth.role === `admin`) {
      responseData.lawFirm = lawyerData.law_firm;
      responseData.street = lawyerData.street;
      responseData.zip = lawyerData.zip;
      responseData.city = lawyerData.city_lawyer;
      responseData.phoneNumber = lawyerData.phone_number_lawyer;
      responseData.email = lawyerData.email_lawyer;
      responseData.description = lawyerData.description;
      responseData.urgency = lawyerData.urgency;
      responseData.creationDate = lawyerData.creation_date;
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      data: {
        responseData,
        specialities,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getLawyer;
