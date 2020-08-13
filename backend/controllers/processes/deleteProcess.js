"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { differenceInHours } = require("date-fns");
const { generateError } = require("../../helpers");

async function deleteProcess(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idProcess, idUser } = req.params;

    // Comprobamos que el proceso existe
    const [process] = await connection.query(
      `
      SELECT status_process, creation_date
      FROM processes
      WHERE id=?
      `,
      [idProcess]
    );

    // Verificamos que es el usuario que firma pa petición o el admin
    if (Number(idUser) !== req.auth.id && req.auth.role !== `admin`) {
      throw generateError(
        `Tienes que ser el usuario que abrio el proceso o el admin`,
        401
      );
    }

    const status = process[0].status_process;

    // Calculamos las horas que pasaron desde su creación y si supera 24 no dejamos eliminar,
    // único que esté resuelto o sea el admin el que lo borre
    const date = process[0].creation_date;
    const now = new Date();
    const result = differenceInHours(now, date);

    if (result > 23 && status !== `resuelto` && req.auth.role !== `admin`) {
      throw generateError(
        `Para poder eliminar un proceso tiene que ser en las primeras 24 horas, que esté resuelto o que seas el admin`,
        403
      );
    }

    // Borramos el proceso con id de usuario  e id de proceso que le pasamos (Desactivamos el proceso en la bbdd)
    await connection.query(
      `
            UPDATE processes P
            SET P.active=false
            WHERE P.id=?
            `,
      [idProcess]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `El processo con id:${idProcess} del usuario con id:${idUser} ha sido borrado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteProcess;
