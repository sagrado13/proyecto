"use strict";

// Módulos necesarios
const { getConnection } = require("../bbdd");
const jsonwebtoken = require("jsonwebtoken");
const { generateError } = require("../helpers");

async function isLawyer(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Extraemos el token y si no hay lanzamos un error
    const { authorization } = req.headers;

    if (!authorization) {
      const authError = new Error(`Falta autorización`);
      authError.httpStatus = 401;
      throw authError;
    }

    // Validamos el token y lo decodificamos
    let tokenInfo;
    try {
      tokenInfo = jsonwebtoken.verify(authorization, process.env.SECRET);
    } catch (error) {
      throw generateError(`El token no es válido`, 401);
    }

    // Comparamos
    const [result] = await connection.query(
      `
      SELECT last_auth_update
      FROM lawyers
      WHERE id=?
      `,
      [tokenInfo.id]
    );

    if (result.length === 0) {
      throw generateError(`El abogado no existe en la base de datos`, 404);
    }

    // Verificamos que sea abogado o admin
    if (tokenInfo.role === `normal`) {
      throw generateError(`No tienes acceso a los datos de otra persona`, 401);
    }

    // Verificamos si la fecha de creación del token es menor que la que tenemos en la bbdd
    const tokenCreatedAt = new Date(tokenInfo.iat * 1000);
    const lawyerLastAuthUpdate = new Date(result[0].last_auth_update);

    if (tokenCreatedAt < lawyerLastAuthUpdate) {
      throw generateError(
        `El token ya no es válido, vuelve hacer login para renovarlo`,
        401
      );
    }

    // Metemos el contenido de tokenInfo en la petición para usarlo en un futuro
    req.auth = tokenInfo;

    // Pasamos al siguiente middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isLawyer;
