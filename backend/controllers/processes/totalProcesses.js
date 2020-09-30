"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

async function totalProcesses(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Consulta para sacar el total de procesos abiertos
    const [processes] = await connection.query(
      `
            SELECT COUNT(id) AS total_processes
            FROM processes 
            `
    );

    // Miramos si tiene algún proceso y sino lanzamos un error
    if (processes.length === 0) {
      throw generateError(`No hay ningún proceso`, 404);
    }

    let now = new Date();
    let year = now.getFullYear();

    // Consulta para sacar el número de procesos abiertos en el años en curso
    const [processesThisYear] = await connection.query(
      `
            SELECT COUNT(id) AS total_processes_this_year
            FROM processes 
            WHERE update_date BETWEEN '${year}-01-01 00:00:00' AND '${year}-12-31 23:59:59'
            `
    );
    // Miramos si tiene algún proceso y sino lanzamos un error
    if (processesThisYear.length === 0) {
      throw generateError(`No hay ningún proceso en ${year}`, 404);
    }

    // Conskulta para sacar el número total de procesos resueltos
    const [processesSolved] = await connection.query(
      `
      SELECT COUNT(id) AS total_processes_solved
          FROM processes
          WHERE status_process='Resuelto'
          `
    );

    // Miramos si tiene algún proceso y sino lanzamos un error
    if (processesSolved.length === 0) {
      throw generateError(`No hay ningún proceso resuelto`, 404);
    }

    // Consulta para sacar el número de procesos resueltos en el año en curso
    const [processesSolvedThisYear] = await connection.query(
      `
          SELECT COUNT(id) AS total_processes_solved_this_year
          FROM processes
          WHERE status_process='Resuelto' AND update_date BETWEEN '${year}-01-01 00:00:00' AND '${year}-12-31 23:59:59'
          `
    );

    // Miramos si tiene algún proceso y sino lanzamos un error
    if (processesSolvedThisYear.length === 0) {
      throw generateError(`No hay ningún proceso resuelto en ${year}`, 404);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      data: {
        processes,
        processesThisYear,
        processesSolved,
        processesSolvedThisYear,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = totalProcesses;
