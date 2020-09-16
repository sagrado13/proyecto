"use strict";

// Módulos necesarios
const { getConnection } = require("../../bbdd");
const jsonwebtoken = require("jsonwebtoken");
const { generateError } = require("../../helpers");

const { loginSchema } = require("../../validators/userValidators");

async function loginUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { emailOrLogin, password } = req.body;

    // Comprobamos los datos que se reciben
    await loginSchema.validateAsync(req.body);

    // Verificamos el login o email y la password
    const [user] = await connection.query(
      `
            SELECT id, name, picture_user, role, low_reason, active, update_date, password
            FROM users
            WHERE login_user=? AND password=SHA2(?, 512) OR email_user=? AND password=SHA2(?, 512)
            `,
      [emailOrLogin, password, emailOrLogin, password]
    );

    if (user.length === 0) {
      throw generateError(
        `No hay ningún usuario con los datos introducidos, revisa que sean correctos`,
        400
      );
      // Error si está dado de baja
    } else if (user[0].low_reason !== null) {
      throw generateError(`El usuario está dado de baja`, 400);

      // Si aún está sin activar no le dejamos hacer login
    } else if (!user[0].active) {
      throw generateError(
        `El usuario está registrado pero no activado. Por favor revisa tu email y activalo`,
        400
      );
    }

    // Generamos un token
    const tokenInfo = {
      id: user[0].id,
      role: user[0].role,
    };

    const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
      expiresIn: `30d`,
    });

    // Actualizamos la bbdd con la fecha del login
    await connection.query(
      `
      UPDATE users
      SET update_date=UTC_TIMESTAMP
      WHERE id=?
      `,
      [user[0].id]
    );

    // Devolvemos una respuesta con el token
    res.send({
      status: `ok`,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginUser;
