"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

const {
  editBudgetUserSchema,
  editBudgetLawyerSchema,
} = require("../../validators/budgetValidators");

async function editBudget(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser, idLawyer, idProcess, idBudget } = req.params;
    const { status, message } = req.body;

    if (idUser) {
      // Comprobamos los datos
      await editBudgetUserSchema.validateAsync(req.body);

      // Comprobamos que es el usuario que firma la petición
      if (req.auth.id !== Number(idUser) && req.auth.role !== `admin`) {
        throw generateError(`No tienes permiso para editar el proceso`, 401);
      }

      // Comprobamos que el presupuesto existe para el proceso determinado
      const [userBudget] = await connection.query(
        `
            SELECT status_budget
            FROM budgets
            WHERE id=? AND id_process=?
            `,
        [idBudget, idProcess]
      );

      if (userBudget.length === 0) {
        throw generateError(
          `No existe presupuesto con id:${idBudget} para el proceso con id:${idProcess}`,
          404
        );
      }

      // Comprobamos que el estado no está aceptado o rechazado
      if (
        userBudget[0].status_budget === `aceptado` ||
        userBudget[0].status_budget === `rechazado`
      ) {
        throw generateError(
          `No se puede modificar el estado si ya esta aceptado o rechazado`,
          400
        );
      }

      // Actualizamos la bbdd
      await connection.query(
        `
         UPDATE budgets
         SET status_budget=?, update_date=UTC_TIMESTAMP
         WHERE id=? AND id_process=?
        `,
        [status, idBudget, idProcess]
      );

      if (status.toLowerCase() === `aceptado`) {
        await connection.query(
          `
                UPDATE processes
                SET status_process='pendiente de una resolución', update_date=UTC_TIMESTAMP
                WHERE id=?
                `,
          [idProcess]
        );
      }
      if (status.toLowerCase() === `rechazado`) {
        await connection.query(
          `
                UPDATE processes
                SET status_process='presupuesto rechazado', update_date=UTC_TIMESTAMP
                WHERE id=?
                `,
          [idProcess]
        );
      }

      // Damos una respuesta
      res.send({
        idBudget,
        status,
      });
    }

    if (idLawyer) {
      // Comprobamos los datos
      await editBudgetLawyerSchema.validateAsync(req.body);

      // Verificamos que es el abogado que firma la petción
      if (req.auth.id !== Number(idLawyer) && req.auth.role !== `admin`) {
        throw generateError(`No tienes permiso para editar el proceso`, 401);
      }

      // Comprobamos que el presupuesto existe para el proceso
      const [lawyerBudget] = await connection.query(
        `
            SELECT status_budget
            FROM budgets
            WHERE id=? AND id_process=?
            `,
        [idBudget, idProcess]
      );

      if (lawyerBudget.length === 0) {
        throw generateError(
          `No existe presupuesto con id:${idBudget} para el proceso con id:${idProcess}`,
          404
        );
      }

      // Actualizamos la bbdd
      await connection.query(
        `
            UPDATE budgets
            SET message_budget=?, update_date=UTC_TIMESTAMP
            WHERE id=? AND id_process=?
            `,
        [message, idBudget, idProcess]
      );
      // Damos una respuesta
      res.send({
        idBudget,
        message,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editBudget;
