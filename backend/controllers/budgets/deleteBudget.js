"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { differenceInHours } = require("date-fns");
const { generateError } = require("../../helpers");

async function deleteBudget(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idLawyer, idProcess, idBudget } = req.params;

    // Verificamos que es el mismo abogado que firma la petición o el admin
    if (Number(idLawyer) !== req.auth.id && req.auth.role !== `admin`) {
      throw generateError(
        `Tienes que ser el abogado que creo el presupuesto o el admin`,
        401
      );
    }

    // Verificamos si el presupuesto existe para ese proceso
    const [budget] = await connection.query(
      `
            SELECT creation_date, status_budget
            FROM budgets
            WHERE id=? AND id_process=?
            `,
      [idBudget, idProcess]
    );

    if (budget.length === 0) {
      throw generateError(
        `No existe ningún presupuesto con el id:${idBudget} para el proceso con id:${idProcess}`,
        404
      );
    }

    // Calculamos las horas que pasaron desde su creación y si supera 24 no lo dejamos eliminar,
    // único que esté pendiente o sea el admin el que lo borre
    const date = budget[0].creation_date;
    const now = new Date();
    const result = differenceInHours(now, date);
    console.log(result);

    if (result > 23 && req.auth.role !== `admin`) {
      throw generateError(
        `Para poder eliminar un presupuesto tiene que ser en las primeras 24 horas o que seas el admin`,
        403
      );
    }

    if (
      budget[0].status_budget !== `pendiente de una respuesta` &&
      req.auth.role !== `admin`
    ) {
      throw generateError(
        `No puedes eliminar un presupuesto que ya está aceptado o rechazado`,
        400
      );
    }

    // Borramos el presupuesto
    await connection.query(
      `
      DELETE FROM budgets
      WHERE id=?
      `,
      [idBudget]
    );

    // Actualizamos processes cambiando el estado a pendiente de presupuesto
    await connection.query(
      `
      UPDATE processes P
      SET P.status_process='pendiente de presupuesto'
      WHERE P.id=? AND P.id_lawyer=?
      `,
      [idProcess, idLawyer]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `El presupuesto con id:${idBudget} del proceso con id:${idProcess} ha sido borrado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteBudget;
