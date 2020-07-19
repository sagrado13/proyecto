"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

const {
  editProcessUserSchema,
  editProcessLawyerSchema,
} = require("../../validators/processValidators");

async function editProcess(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser, idLawyer, idProcess } = req.params;
    const { observations, status } = req.body;

    if (idUser) {
      // Comprobamos los datos
      await editProcessUserSchema.validateAsync(req.body);

      const [userProcess] = await connection.query(
        `
            SELECT observations, status_process, id_user
            FROM processes
            WHERE id=?
            `,
        [idProcess]
      );

      // Comprobamos que es el usuario que firma la petición
      if (req.auth.id !== Number(userProcess[0].id_user)) {
        throw generateError(`No tienes permiso para editar el proceso`, 401);
      }

      // Verificamos si el estado es resuelto
      if (userProcess[0].status_process === `resuelto`) {
        throw generateError(
          `No puedes editar observations si el proceso está resuelto`,
          400
        );
      }

      // Actualizamos la bbdd
      await connection.query(
        `
         UPDATE processes
         SET observations=?, update_date=UTC_TIMESTAMP
         WHERE id=?
        `,
        [observations, idProcess]
      );

      // Damos una respuesta
      res.send({
        idProcess,
        observations,
      });
    }

    if (idLawyer) {
      // Comprobamos los datos
      await editProcessLawyerSchema.validateAsync(req.body);

      const [lawyerProcess] = await connection.query(
        `
            SELECT status_process, id_lawyer
            FROM processes
            WHERE id=?
            `,
        [idProcess]
      );

      // Comprobamos si es el abogado que firma la petición
      if (req.auth.id !== Number(lawyerProcess[0].id_lawyer)) {
        throw generateError(`No tienes permiso para editar el proceso`, 401);
      }

      // Actualizamos la bbdd
      await connection.query(
        `
            UPDATE processes
            SET status_process='resuelto', update_date=UTC_TIMESTAMP
            WHERE id=?
            `,
        [idProcess]
      );
      // Damos una respuesta
      res.send({
        idProcess,
        status,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editProcess;
