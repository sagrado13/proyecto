"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { generateError } = require("../../helpers");

const { ratingSchema } = require("../../validators/budgetValidators");

async function rating(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idUser, idProcess } = req.params;
    const { rating, opinion } = req.body;
    // Comprobamos los datos
    console.log(rating);
    await ratingSchema.validateAsync(req.body);

    // Verificamos el usuario que va a votar es el que firma la petición
    if (req.auth.id !== Number(idUser) && req.auth.role !== `admin`) {
      throw generateError(`No puedes votar un proceso de otro usuario`, 401);
    }

    // Verificamos que existe el proceso para el usuario especificado
    const [process] = await connection.query(
      `
          SELECT id, status_process
          FROM processes
          WHERE id=? AND id_user=? AND active=true
          `,
      [idProcess, idUser]
    );

    if (process.length < 1) {
      throw generateError(
        `No se encuentra el proceso con id:${idProcess} para el usuario con id:${idUser}`,
        404
      );
    }

    // Verificamos que el estado del proceso sea Resuelto
    if (process[0].status_process !== `Resuelto`) {
      throw generateError(
        `El proceso con id:${idProcess} tiene que estar resuelto para poder votarlo`,
        409
      );
    }

    const [budget] = await connection.query(
      `
      SELECT id, status_budget, rating, opinion
      FROM budgets
      WHERE id_process=?
      `,
      [idProcess]
    );

    // Verificamos que no está votado
    if (budget[0].rating > 0) {
      throw generateError(
        `El proceso  ya está votado y no se puede modificar el voto`,
        409
      );
    }

    // Guardamos el voto en la bbdd
    await connection.query(
      `
          UPDATE budgets
          SET rating=?, opinion=?, update_date=UTC_TIMESTAMP
          WHERE id=? AND id_process=?
          `,
      [rating, opinion, budget[0].id, idProcess]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Puntuación enviada correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = rating;
