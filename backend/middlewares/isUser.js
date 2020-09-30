"use strict";

// Módulos necesarios
const { getConnection } = require("../bbdd");
const jsonwebtoken = require("jsonwebtoken");
const { generateError } = require("../helpers");

async function isUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Extraemos el token y si no hay lanzamos un error
    const { authorization } = req.headers;

    if (!authorization) {
      throw generateError(`Falta autorización`, 401);
    }

    // Validamos el token y lo decodificamos
    let tokenInfo;
    try {
      tokenInfo = jsonwebtoken.verify(authorization, process.env.SECRET);
    } catch (error) {
      throw generateError(`El token no es válido`, 401);
    }

    // Comprobamos que el usuario existe
    const [result] = await connection.query(
      `
      SELECT role, last_auth_update
      FROM users
      WHERE id=?
      `,
      [tokenInfo.id]
    );

    if (result.length === 0) {
      throw generateError(`El usuario no existe en la base de datos`, 404);
    }

    // Verificamos que sea usuario o admin
    if (!tokenInfo.role === true) {
      throw generateError(`No tienes acceso a los datos de otra persona`, 401);
    }

    // Verificamos si la fecha de creación del token es menor que la que tenemos en la bbdd
    const tokenCreatedAt = new Date(tokenInfo.iat * 1000);
    const userLastAuthUpdate = new Date(result[0].last_auth_update);

    if (tokenCreatedAt < userLastAuthUpdate) {
      throw generateError(
        `El token ya no es válido, vuelve hacer login para renovarlo`,
        401
      );
    }

    // Metemos el contenido de tokenInfo en la petición para usarlo más tarde
    req.auth = tokenInfo;

    // Pasamos al siguiente middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isUser;
