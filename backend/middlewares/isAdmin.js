"use strict";

async function isAdmin(req, res, next) {
  if (req.auth.role === `admin`) {
    next();
  } else {
    const error = new Error(`Tienes que ser administrador`);
    error.httpStatus = 403;
    next(error);
  }
}

module.exports = isAdmin;
