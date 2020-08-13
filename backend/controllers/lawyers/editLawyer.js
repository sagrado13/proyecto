"use strict";

const { getConnection } = require("../../bbdd");
const {
  processAndSaveLawyersPicture,
  generateError,
} = require("../../helpers");
const { editLawyerSchema } = require("../../validators/lawyerValidators");

async function editLawyer(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { idLawyer } = req.params;
    const {
      lawFirm,
      street,
      zip,
      city,
      phoneNumber,
      login,
      description,
      urgency,
    } = req.body;

    // Comprobamos los datos
    await editLawyerSchema.validateAsync(req.body);

    // Comprobamos que el abogado existe y es el que firma la petición
    const [lawyer] = await connection.query(
      `
      SELECT id, law_firm, street, zip, city_lawyer, phone_number_lawyer, login_lawyer, picture_lawyer,
      description, urgency
      FROM lawyers
      WHERE id=?
      `,
      [idLawyer]
    );

    if (req.auth.id !== Number(idLawyer)) {
      throw generateError(`No puedes editar otro abogado`, 401);
    }

    if (lawyer.length === 0) {
      throw generateError(`El abogado con id:${idLawyer} no existe`, 404);
    }

    // Verificamos que el lawFirm no existen en la bbdd
    if (lawFirm !== lawyer[0].law_firm) {
      const [existLawyer] = await connection.query(
        `
            SELECT id
            FROM lawyers
            WHERE law_firm=?
            `,
        [lawFirm]
      );

      if (existLawyer.length > 0) {
        throw generateError(
          `Ya existe un abogado con el lawFirm:${lawFirm}`,
          409
        );
      }
    }

    // Verificamos que el login no existen en la bbdd
    if (login !== lawyer[0].login_lawyer) {
      const [existLawyer] = await connection.query(
        `
            SELECT id
            FROM lawyers
            WHERE login_lawyer=?
            `,
        [login]
      );

      if (existLawyer.length > 0) {
        throw generateError(`Ya existe un abogado con el login:${login}`, 409);
      }
    }

    // Si se recibe phoneNumber y es distinto al que hay en la bbdd verificamos
    // que no existe ningún abogado con ese número
    if (phoneNumber) {
      if (phoneNumber !== lawyer[0].phone_number_lawyer) {
        const [existPhoneNumberLawyer] = await connection.query(
          `
            SELECT id
            FROM lawyers
            WHERE phone_number_lawyer=?
          `,
          [phoneNumber]
        );

        if (existPhoneNumberLawyer.length > 0) {
          throw generateError(
            `Ya existe un abogado con el phoneNumber:${phoneNumber}`,
            409
          );
        }
      }
    }

    // Comprobamos que no existe ningún usuario con el mismo phoneNumber o login en la bbdd
    const [existingUser] = await connection.query(
      `
      SELECT id
      FROM users
      WHERE phone_number_user=? OR login_user=?
      `,
      [phoneNumber, login]
    );

    if (existingUser.length > 0) {
      throw generateError(
        `Ya existe un usuario con ese phoneNumber o login`,
        409
      );
    }

    // Si nos mandan imagen la procesamos y guardamos
    let savedFileName;

    if (req.files && req.files.avatar) {
      try {
        savedFileName = await processAndSaveLawyersPicture(req.files.avatar);
      } catch (error) {
        throw generateError(
          `No se puede procesar la imagen, inténtalo de nuevo`,
          400
        );
      }
    } else {
      savedFileName = lawyer[0].picture_lawyer;
    }

    // Actualizamos al abogado
    await connection.query(
      `
        UPDATE lawyers
        SET law_firm=?, street=?, zip=?, city_lawyer=?, phone_number_lawyer=?, login_lawyer=?, 
        picture_lawyer=?, description=?, urgency=?, update_date=UTC_TIMESTAMP
        WHERE id=?
          `,
      [
        lawFirm,
        street,
        zip,
        city,
        phoneNumber,
        login,
        savedFileName,
        description,
        urgency,
        idLawyer,
      ]
    );

    // Damos una respuesta
    res.send({
      status: `ok`,
      message: `Abogado actualizado correctamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editLawyer;
