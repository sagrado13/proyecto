"use strict";

// Módulos necesarios
const crypto = require("crypto");
const sendmail = require("@sendgrid/mail");
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");

function randomString(length = 20) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

// Función para enviar emails
async function sendMail({ email, title, content }) {
  // Configura api key de sendgrid
  sendmail.setApiKey(process.env.SENDGRID_KEY);

  // Mensaje
  const message = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: title,
    text: content,
    html: `
      <div>
        <h1>${title}</h1>
        <p>${content}</p>
      </div>
    `,
  };

  // Enviar mensaje
  await sendmail.send(message);
}

// Directorio de avatares de usuarios
const userPictureUpload = path.join(__dirname, process.env.UPLOADS_DIR_USERS);

// Función para formatear y guardar avatar de usuario
async function processAndSaveUsersPicture(uploadedPicture) {
  // Creamos el directorio con recursive: true para que no de error si hay subdirectorios
  await fs.mkdir(userPictureUpload, { recursive: true });

  // Leeemos la imagen
  const picture = sharp(uploadedPicture.data);

  // Sacamos la información
  const pictureInfo = await picture.metadata();

  // Cambiamos el tamaño si es demasiado grande
  if (pictureInfo.width > 800) {
    picture.resize(800);
  }

  // Guardamos la imagen en el directorio
  const pictureFileName = `${uuid.v4()}.jpg`;
  await picture.toFile(path.join(userPictureUpload, pictureFileName));

  // Devolvemos el nombre con el que se guarda
  return pictureFileName;
}

// Borrar avatar de usuario
async function deleteUserUpload(uploadedPicture) {
  await fs.unlink(path.join(userPictureUpload, uploadedPicture));
}

// Directorio de avatares de abogados
const lawyerPictureUpload = path.join(
  __dirname,
  process.env.UPLOADS_DIR_LAWYERS
);

// Función para formatear y guardar avatar de abogados
async function processAndSaveLawyersPicture(uploadedPicture) {
  // Creamos el directorio con recursive: true para que no de error si hay subdirectorios
  await fs.mkdir(lawyerPictureUpload, { recursive: true });

  // Leeemos la imagen
  const picture = sharp(uploadedPicture.data);

  // Sacamos la información
  const pictureInfo = await picture.metadata();

  // Cambiamos el tamaño si es demasiado grande
  if (pictureInfo.width > 800) {
    picture.resize(800);
  }

  // Guardamos la imagen en el directorio
  const pictureFileName = `${uuid.v4()}.jpg`;
  await picture.toFile(path.join(lawyerPictureUpload, pictureFileName));

  // Devolvemos el nombre con el que se guarda
  return pictureFileName;
}

// Borrar avatar de usuario
async function deleteLawyerUpload(uploadedPicture) {
  await fs.unlink(path.join(lawyerPictureUpload, uploadedPicture));
}

// Función para generar errores
function generateError(message, code = 500) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

module.exports = {
  randomString,
  sendMail,
  processAndSaveUsersPicture,
  deleteUserUpload,
  processAndSaveLawyersPicture,
  deleteLawyerUpload,
  generateError,
};
