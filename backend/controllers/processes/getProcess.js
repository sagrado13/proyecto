"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function getProcess(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser, idLawyer, idProcess } = req.params;

    if (idUser) {
      const [processUser] = await connection.query(
        `
            SELECT P.message_process, P.observations, P.status_process, P.id_lawyer, 
            P.creation_date, P.update_date, L.law_firm, L.city_lawyer, L.phone_number_lawyer, 
            L.email_lawyer, L.picture_lawyer, B.id, B.status_budget, B.message_budget, B.price, 
            B.rating, B.opinion
            FROM processes P
            LEFT JOIN lawyers L ON P.id_lawyer=L.id
            LEFT JOIN budgets B ON B.id_process=P.id
            WHERE P.id_user=? AND P.id=? AND P.active=true
            `,
        [idUser, idProcess]
      );

      // Comprobamos que es el usuario que accede a los procesos es el mismo que firma la petición
      if (req.auth.id !== Number(idUser) && req.auth.role !== `admin`) {
        throw generateError(`No tienes permiso`, 401);
      }

      // Miramos si tiene algún proceso y sino lanzamos un error
      if (processUser.length === 0) {
        throw generateError(
          `No tienes ningún proceso abierto con la id:${idProcess}`,
          404
        );
      }
      // Damos una respuesta
      res.send({
        status: `ok`,
        data: processUser,
      });
    }

    if (idLawyer) {
      const [processLawyer] = await connection.query(
        `
            SELECT P.id, P.message_process, P.observations, P.status_process, P.id_user, P.id_lawyer,
            P.creation_date, P.update_date, U.name, U.surname, U.city_user, U.phone_number_user, 
            U.email_user, U.picture_user, B.status_budget, B.message_budget, B.price, 
            B.rating, B.opinion
            FROM processes P
            LEFT JOIN users U ON P.id_user=U.id
            LEFT JOIN budgets B ON B.id_process=P.id
            WHERE P.id_lawyer=? AND P.id=? AND P.active=true
            `,
        [idLawyer, idProcess]
      );

      // Comprobamos que es el abogado que firma la petición
      if (req.auth.id !== Number(idLawyer) && req.auth.role !== `admin`) {
        throw generateError(
          `Tienes que ser el abogado destinatario del proceso`,
          401
        );
      }

      // Comprobamos si tiene algún proceso y sino tiene lanzamos un error
      if (processLawyer.length === 0) {
        throw generateError(
          `No tienes ningún proceso solicitado con la id:${idProcess}`,
          404
        );
      }

      // Damos una respuesta
      res.send({
        status: `ok`,
        data: processLawyer,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getProcess;
