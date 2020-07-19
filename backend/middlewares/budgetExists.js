"use strict";

// Módulos necesarios
const { getConnection } = require("../bbdd");
const { generateError } = require("../helpers");

async function budgetExists(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idBudget } = req.params;

    // Comprobamos que el presupuesto que queremos editar exista en la bbdd
    const [budget] = await connection.query(
      `SELECT id
      FROM budgets
      WHERE id=?
`,
      [idBudget]
    );

    if (budget.length === 0) {
      throw generateError(`El presupuesto con id:${idBudget} no existe`, 404);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = budgetExists;
