"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function listProcess(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser, idLawyer } = req.params;
    const { order, direction } = req.query;

    // Dirección del orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

    // Procesamos el campo order
    let orderBy;
    switch (order) {
      case "creationDate":
        orderBy = "creation_date";
        break;
      default:
        orderBy = "status_process";
    }

    if (idUser) {
      const [processUser] = await connection.query(
        `
            SELECT P.id, P.message_process, P.observations, P.status_process, P.id_user, P.creation_date, 
            P.update_date, L.law_firm, L.city_lawyer, B.status_budget, B.price, B.rating
            FROM processes P
            LEFT JOIN lawyers L ON P.id_lawyer=L.id
            LEFT JOIN budgets B ON B.id_process=P.id
            WHERE P.id_user=? AND P.active=true AND P.status_process!='Resuelto'
            ORDER BY ${orderBy} ${orderDirection}
            `,
        [idUser]
      );

      // Comprobamos que el usuario que accede a los procesos es el mismo que firma la petición o el admin
      if (req.auth.id !== Number(idUser) && req.auth.role !== `admin`) {
        throw generateError(
          `No tienes permiso para mirar los procesos de otros usuarios`,
          401
        );
      }

      // Miramos si tiene algún proceso y sino lanzamos un error
      if (processUser.length === 0) {
        throw generateError(
          `No tienes ningún proceso abierto sin resolver`,
          404
        );
      }

      const [processSolvedUser] = await connection.query(
        `
            SELECT P.id, P.message_process, P.observations, P.status_process, P.id_user, P.creation_date, 
            P.update_date, L.law_firm, L.city_lawyer, B.status_budget, B.price, B.rating
            FROM processes P
            LEFT JOIN lawyers L ON P.id_lawyer=L.id
            LEFT JOIN budgets B ON B.id_process=P.id
            WHERE P.id_user=? AND P.active=true AND P.status_process='Resuelto'
            ORDER BY ${orderBy} ${orderDirection}
            `,
        [idUser]
      );

      // Miramos si tiene algún proceso y sino lanzamos un error
      if (processSolvedUser.length === 0) {
        throw generateError(`No tienes ningún proceso abierto resuelto`, 404);
      }

      // Damos una respuesta
      res.send({
        status: `ok`,
        data: processUser,
        processSolvedUser,
      });
    }

    if (idLawyer) {
      const [processLawyer] = await connection.query(
        `
            SELECT P.id, P.message_process, P.observations, P.status_process, P.id_lawyer, P.creation_date, 
            P.update_date, U.name, U.surname, U.city_user, B.status_budget, B.price, B.rating
            FROM processes P
            LEFT JOIN users U ON P.id_user=U.id
            LEFT JOIN budgets B ON B.id_process=P.id
            WHERE P.id_lawyer=? AND P.active=true AND P.status_process!='Resuelto'
            ORDER BY ${orderBy} ${orderDirection}
            `,
        [idLawyer]
      );

      // Comprobamos que es el abogado que firma la petición o el admin
      if (req.auth.id !== Number(idLawyer) && req.auth.role !== `admin`) {
        throw generateError(
          `Tienes que ser el abogado destinatario del proceso`,
          401
        );
      }

      // Comprobamos si tiene algún proceso y sino tiene lanzamos un error
      if (processLawyer.length === 0) {
        throw generateError(
          `No tienes ningún proceso solicitado pendiente de resolver`,
          404
        );
      }

      const [processSolvedLawyer] = await connection.query(
        `
            SELECT P.id, P.message_process, P.observations, P.status_process, P.id_lawyer, P.creation_date, 
            P.update_date, U.name, U.surname, U.city_user, B.status_budget, B.price, B.rating
            FROM processes P
            LEFT JOIN users U ON P.id_user=U.id
            LEFT JOIN budgets B ON B.id_process=P.id
            WHERE P.id_lawyer=? AND P.active=true AND P.status_process='Resuelto'
            ORDER BY ${orderBy} ${orderDirection}
            `,
        [idLawyer]
      );

      // Comprobamos si tiene algún proceso y sino tiene lanzamos un error
      if (processSolvedLawyer.length === 0) {
        throw generateError(
          `No tienes ningún proceso solicitado resuelto`,
          404
        );
      }

      // Damos una respuesta
      res.send({
        status: `ok`,
        data: processLawyer,
        processSolvedLawyer,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listProcess;
