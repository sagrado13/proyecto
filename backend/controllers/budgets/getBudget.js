"use strict";

// Módulo necesario
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function getBudget(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser, idLawyer, idProcess } = req.params;
    if (idUser) {
      const [budgetUser] = await connection.query(
        `
            SELECT B.id, B.status_budget, B.message_budget, B.price, B.rating, B.opinion, B.id_lawyer, 
            B.creation_date, B.update_date, L.law_firm, L.city_lawyer, L.phone_number_lawyer, 
            L.email_lawyer, L.picture_lawyer, P.id_user
            FROM budgets B
            LEFT JOIN lawyers L ON B.id_lawyer=L.id
            LEFT JOIN processes P ON B.id_process=P.id
            WHERE P.id_user=? AND B.id_process=?
            `,
        [idUser, idProcess]
      );

      // Comprobamos que el usuario que accede al presupuesto es el mismo que firma la petición
      if (req.auth.id !== Number(idUser) && req.auth.role !== `admin`) {
        throw generateError(
          `No tienes permiso, para ver el presupuesto de otro usuario`,
          401
        );
      }

      // Miramos si existe y sino lanzamos un error
      if (budgetUser.length === 0) {
        throw generateError(
          `No tienes ningún presupuesto para este proceso`,
          404
        );
      }

      // Damos una respuesta
      res.send({
        status: `ok`,
        data: budgetUser,
      });
    }

    if (idLawyer) {
      const [budgetLawyer] = await connection.query(
        `
            SELECT B.id, B.status_budget, B.message_budget, B.price, B.rating, B.opinion, B.id_process, B.id_lawyer, B.creation_date, 
            B.update_date, U.name, U.surname, U.city_user, U.phone_number_user, U.email_user, 
            U.picture_user, P.message_process, P.status_process, P.id_user
            FROM budgets B
            INNER JOIN processes P ON B.id_process=P.id
            INNER JOIN users U ON P.id_user=U.id
            WHERE B.id_lawyer=? AND B.id_process=?
            `,
        [idLawyer, idProcess]
      );

      // Comprobamos que es el abogado que firma la petición
      if (req.auth.id !== Number(idLawyer) && req.auth.role !== `admin`) {
        throw generateError(
          `Tienes que ser el abogado que creó el presupuesto`,
          401
        );
      }

      // Comprobamos si existe y sino lanzamos un error
      if (budgetLawyer.length === 0) {
        throw generateError(
          `No tienes ningún presupuesto creado para este proceso`,
          404
        );
      }

      // Damos una respuesta
      res.send({
        status: `ok`,
        data: budgetLawyer,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBudget;
