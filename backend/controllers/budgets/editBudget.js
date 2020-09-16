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
    const { status, message, price } = req.body;

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

      // Comprobamos que el estado no está Aceptado o Rechazado
      if (
        userBudget[0].status_budget === `Aceptado` ||
        userBudget[0].status_budget === `Rechazado`
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

      if (status === `Aceptado`) {
        await connection.query(
          `
                UPDATE processes
                SET status_process='Pendiente de una resolución', update_date=UTC_TIMESTAMP
                WHERE id=?
                `,
          [idProcess]
        );
      }
      if (status === `Rechazado`) {
        await connection.query(
          `
                UPDATE processes
                SET status_process='Presupuesto rechazado', update_date=UTC_TIMESTAMP
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

      // Comprobamos que el estado no está Aceptado o Rechazado
      /*       if (
        lawyerBudget[0].status_budget === `Aceptado` ||
        lawyerBudget[0].status_budget === `Rechazado`
      ) {
        throw generateError(
          `No se puede modificar el estado si ya esta aceptado o rechazado`,
          400
        );
      } */

      if (req.auth.role === `admin`) {
        // Actualizamos la bbdd
        await connection.query(
          `
            UPDATE budgets
            SET message_budget=?, price=?, update_date=UTC_TIMESTAMP
            WHERE id=? AND id_process=?
            `,
          [message, price, idBudget, idProcess]
        );
      } else {
        // Actualizamos la bbdd
        await connection.query(
          `
              UPDATE budgets
              SET message_budget=?, update_date=UTC_TIMESTAMP
              WHERE id=? AND id_process=?
              `,
          [message, idBudget, idProcess]
        );
      }

      // Damos una respuesta
      res.send({
        status: `ok`,
        message: `Presupuesto modificado correctamente`,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editBudget;
