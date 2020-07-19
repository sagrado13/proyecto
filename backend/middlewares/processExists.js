"use strict";

// Módulos necesarios
const { getConnection } = require("../bbdd");
const { generateError } = require("../helpers");

async function processExists(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idProcess } = req.params;

    // Comprobamos que el proceso que queremos editar exista en la bbdd
    const [process] = await connection.query(
      `
    SELECT id, active
    FROM processes
    WHERE id=?
  `,
      [idProcess]
    );

    if (process.length === 0 || process[0].active === 0) {
      throw generateError(`El proceso con id:${idProcess} no existe`, 404);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = processExists;
