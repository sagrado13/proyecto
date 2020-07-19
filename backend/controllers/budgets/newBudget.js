"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { sendMail, generateError } = require("../../helpers");

const { newBudgetSchema } = require("../../validators/budgetValidators");

async function newBudget(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { idLawyer, idProcess } = req.params;
    const { message, price } = req.body;

    // Comprobamos datos
    await newBudgetSchema.validateAsync(req.body);

    // Verificamos que es el abogado que firma la petición
    if (req.auth.id !== Number(idLawyer)) {
      throw generateError(
        `No puedes mandar un presupuesto sin hacer login`,
        401
      );
    }

    // Cogemos datos de abogado para añadirlo al email que se le enviará al usuario
    const [lawyer] = await connection.query(
      `
          SELECT law_firm
          FROM lawyers
          WHERE id=?
          `,
      [idLawyer]
    );

    // Cogemos datos de proceso y comprobamos que existe
    const [process] = await connection.query(
      `
          SELECT id_user, status_process
          FROM processes
          WHERE id=? AND id_lawyer=?
          `,
      [idProcess, idLawyer]
    );

    if (process.length === 0) {
      throw generateError(
        `No existe nigún proceso con el id:${idProcess}`,
        404
      );
    }

    // Verificamos que el proceso no tiene ya presupuesto
    if (process[0].status_process !== `pendiente de presupuesto`) {
      throw generateError(
        `No puedes dar presupuesto para un proceso que ya lo tiene`,
        409
      );
    }

    // Cogemos datos de usuario para mandar email
    const [user] = await connection.query(
      `
          SELECT email_user
          FROM users
          WHERE id=?
          `,
      [process[0].id_user]
    );

    const email = user[0].email_user;

    // Actualizamos tabla proceso poniendo en estado: presupuestado
    await connection.query(
      `
        UPDATE processes
        SET status_process="presupuestado", update_date=UTC_TIMESTAMP
        WHERE id=?
        `,
      [idProcess]
    );

    // Añadimos nuevo presupuesto a bbdd
    await connection.query(
      `
        INSERT INTO budgets(message_budget, price, id_lawyer, id_process, creation_date, update_date)
        VALUES(?, ?, ?, ?, UTC_TIMESTAMP, UTC_TIMESTAMP)
        `,
      [message, price, idLawyer, idProcess]
    );

    // Enviamos email a usuario con el presupuesto
    try {
      await sendMail({
        email,
        title: `Presupuesto recibido de ${lawyer[0].law_firm}`,
        content: `${message}
        
        El importe es ${price}€`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Presupuesto creado, se ha enviado una copia al email del cliente.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newBudget;
