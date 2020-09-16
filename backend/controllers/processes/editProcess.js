"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

const { editProcessUserSchema } = require("../../validators/processValidators");

async function editProcess(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser, idLawyer, idProcess } = req.params;
    const { observations } = req.body;

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
      if (
        req.auth.id !== Number(userProcess[0].id_user) &&
        req.auth.role !== `admin`
      ) {
        throw generateError(`No tienes permiso para editar el proceso`, 401);
      }

      // Verificamos si el estado es Resuelto
      if (userProcess[0].status_process === `Resuelto`) {
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
      const [lawyerBudget] = await connection.query(
        `
        SELECT id, status_budget, id_lawyer
        FROM budgets
        WHERE id_process=?
        `,
        [idProcess]
      );

      // Comprobamos si es el abogado que firma la petición
      if (
        req.auth.id !== Number(lawyerBudget[0].id_lawyer) &&
        req.auth.role !== `admin`
      ) {
        throw generateError(`No tienes permiso para editar el proceso`, 401);
      }

      // Comprobamos si existe presupuesto para ese proceso
      if (lawyerBudget.length === 0) {
        throw generateError(
          `No se puede dar como resuelto un proceso si aún no tiene presupuesto y este no sea aceptado`
        );
      }

      // Comprobamos que el el presupuesto está aceptado
      if (lawyerBudget[0].status_budget !== `Aceptado`) {
        throw generateError(
          `No puedes dar un proceso como resuelto si el presupuesto no está aceptado`,
          400
        );
      }
      console.log(lawyerBudget[0].status_budget);
      // Actualizamos la bbdd
      await connection.query(
        `
            UPDATE processes
            SET status_process='Resuelto', update_date=UTC_TIMESTAMP
            WHERE id=?
            `,
        [idProcess]
      );
      // Damos una respuesta
      res.send({
        status: `ok`,
        message: `Proceso resuelto`,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editProcess;
