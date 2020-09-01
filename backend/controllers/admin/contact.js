"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const { sendMail, generateError } = require("../../helpers");

const { contactSchema } = require("../../validators/adminValidators");

async function contact(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { name, surname, phoneNumber, emailUser, message } = req.body;
    const email = "legalshield5.33@gmail.com";

    // Comprobamos los datos
    await contactSchema.validateAsync(req.body);

    // Montamos el email con los datos que recibimos
    try {
      await sendMail({
        email,
        title: `Sugerencias o dudas de ${name + " " + surname}`,
        content: `${message} Contacta con él en el teléfono: ${phoneNumber} o el email: ${emailUser}`,
      });
    } catch (error) {
      throw generateError(`Error enviando el email`);
    }

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Formulario enviado correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = contact;
