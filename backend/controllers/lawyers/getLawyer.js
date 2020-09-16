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
      L.email_lawyer, L.picture_lawyer, L.description, L.urgency, L.creation_date, L.update_date, 
      (SELECT AVG(rating) FROM budgets WHERE id_lawyer=L.id AND rating>0) AS voteAverage, 
      (SELECT COUNT(rating) FROM budgets WHERE id_lawyer=L.id) AS total_ratings
      FROM lawyers L
      WHERE L.id=? AND active=true
      `,
      [idLawyer]
    );

    if (lawyer.length === 0) {
      throw generateError(
        `El abogado seleccionado ya no está con nosotros`,
        404
      );
    }
    const [specialities] = await connection.query(
      `
      SELECT id, speciality
      FROM specialities
      WHERE id_lawyer=?
      `,
      [idLawyer]
    );

    const [lawyerData] = lawyer;

    const responseData = {
      id: lawyerData.id,
      lawFirm: lawyerData.law_firm,
      street: lawyerData.street,
      zip: lawyerData.zip,
      city: lawyerData.city_lawyer,
      phoneNumber: lawyerData.phone_number_lawyer,
      email: lawyerData.email_lawyer,
      picture: lawyerData.picture_lawyer,
      urgency: lawyerData.urgency,
      description: lawyerData.description,
      voteAverage: lawyerData.voteAverage,
      totalRatings: lawyerData.total_ratings,
      creationDate: lawyerData.creation_date,
      updateDate: lawyerData.update_date,
      login: lawyerData.login_lawyer,
    };

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
