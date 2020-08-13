"use strict";

// Variable de entorno
require("dotenv").config();

// Módulos necesarios
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

// Admin controllers
const listDeletedUsers = require("./controllers/admin/listDeletedUsers");
const reactivateUser = require("./controllers/admin/reactivateUser");
const listDeletedLawyers = require("./controllers/admin/listDeletedLawyers");
const reactivateLawyer = require("./controllers/admin/reactivateLawyer");

// Users controllers
const newUser = require("./controllers/users/newUser");
const validationUser = require("./controllers/users/validationUser");
const loginUser = require("./controllers/users/loginUser");
const getUser = require("./controllers/users/getUser");
const deleteUser = require("./controllers/users/deleteUser");
const editUser = require("./controllers/users/editUser");
const editUserPassword = require("./controllers/users/editUserPassword");
const deleteUserPicture = require("./controllers/users/deleteUserPicture");
const recoverUserPassword = require("./controllers/users/recoverUserPassword");
const resetUserPassword = require("./controllers/users/resetUserPassword");

// Lawyers controllers
const newLawyer = require("./controllers/lawyers/newLawyer");
const validationLawyer = require("./controllers/lawyers/validationLawyer");
const loginLawyer = require("./controllers/lawyers/loginLawyer");
const getLawyer = require("./controllers/lawyers/getLawyer");
const listLawyers = require("./controllers/lawyers/listLawyers");
const deleteLawyer = require("./controllers/lawyers/deleteLawyer");
const editLawyer = require("./controllers/lawyers/editLawyer");
const editLawyerPassword = require("./controllers/lawyers/editLawyerPassword");
const deleteLawyerPicture = require("./controllers/lawyers/deleteLawyerPicture");
const recoverLawyerPassword = require("./controllers/lawyers/recoverLawyerPassword");
const resetLawyerPassword = require("./controllers/lawyers/resetLawyerPassword");
const searchLawyer = require("./controllers/lawyers/searchLawyer");

// Processes controllers
const newProcess = require("./controllers/processes/newProcess");
const editProcess = require("./controllers/processes/editProcess");
const deleteProcess = require("./controllers/processes/deleteProcess");
const getProcesss = require("./controllers/processes/getProcess");
const listProcess = require("./controllers/processes/listProcess");

// Budgets controllers
const newBudget = require("./controllers/budgets/newBudget");
const editBudget = require("./controllers/budgets/editBudget");
const deleteBudget = require("./controllers/budgets/deleteBudget");
const getBudget = require("./controllers/budgets/getBudget");
const rating = require("./controllers/budgets/rating");
const listRating = require("./controllers/budgets/listRating");

// Specialities controllers
const addNewSpeciality = require("./controllers/specialities/addNewSpeciality");
const deleteSpeciality = require("./controllers/specialities/deleteSpeciality");

// Middlewares
const isUser = require("./middlewares/isUser");
const isLawyer = require("./middlewares/isLawyer");
const isAdmin = require("./middlewares/isAdmin");
const processExists = require("./middlewares/processExists");
const budgetExists = require("./middlewares/budgetExists");

const app = express();

// Log de peticiones a consola
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Procesado body tipo JSON
app.use(bodyParser.json());

// Procesado body tipo form-data
app.use(fileUpload());

app.use(express.static("static"));

app.use(cors());

// ADMIN ENDPOINTS

// Listar usuarios dados de baja
// GET - /list-users
app.get("/list-users", isUser, isAdmin, listDeletedUsers);

// Reactivar cuenta de usuario
// GET - /reactivate-user/:idUser
app.get("/reactivate-user/:idUser", reactivateUser);

// Listar abogados dados de baja
// GET - /list-lawyers
app.get("/list-lawyers", isLawyer, isAdmin, listDeletedLawyers);

// Reactivar cuenta de abogado
// GET - /reactivate-lawyer/:idLawyer
app.get("/reactivate-lawyer/:idLawyer", reactivateLawyer);

// USERS ENDPOINTS

// Registro de usuario
// POST - /users
app.post("/users", newUser);

// Validación de nuevo usuario
// GET - /users/validation/:registrationCode
app.get("/users/validation/:registrationCode", validationUser);

// Login de usuario
// POST - /users/login
app.post("/users/login", loginUser);

// Ver información de usuario
// GET - /users/:idUser/data
app.get("/users/:idUser/data", isUser, getUser);

// Borrar usuario
// PUT - /users/:idUser/delete
app.put("/users/:idUser/delete", isUser, deleteUser);

// Editar perfil de usuario
// PUT - /users/:idUser/edit
app.put("/users/:idUser/edit", isUser, editUser);

// Borrar avatar de usuario
// PUT - /users/:idUser/delete-picture
app.put("/users/:idUser/delete-picture", isUser, deleteUserPicture);

// Cambio password y email de usuario
// POST - /users/:idUser/email-password
app.post("/users/:idUser/email-password", isUser, editUserPassword);

// Recuperación password usuario
// POST - /users/recover-password
app.post("/users/recover-password", recoverUserPassword);

// Resetear password usuario
// POST - /users/reset-password/:recoverCode
app.post("/users/reset-password/:recoverCode", resetUserPassword);

// LAWYERS ENDPOINTS

// Registro de abogado
// POST - /lawyers
app.post("/lawyers", newLawyer);

// Validación de nuevo abogado
// GET - /lawyers/validation/:registrationCode
app.get("/lawyers/validation/:registrationCode", validationLawyer);

// Login de abogado
// POST - /lawyers/login
app.post("/lawyers/login", loginLawyer);

// Ver información de abogado por usuario
// GET - /lawyers/:idLawyer/data
app.get("/lawyers/:idLawyer/data", getLawyer);

// Listar todos los abogados
// GET - /lawyers/list
app.get("/lawyers/list", listLawyers);

// Borrar abogado
// PUT - /lawyers/:idLawyer/delete
app.put("/lawyers/:idLawyer/delete", isLawyer, deleteLawyer);

// Editar perfil de abogado
// PUT - /lawyers/:idLawyer/edit
app.put("/lawyers/:idLawyer/edit", isLawyer, editLawyer);

// Borrar avatar de abogado
// PUT - /lawyers/:idLawyer/delete-picture
app.put("/lawyers/:idLawyer/delete-picture", isLawyer, deleteLawyerPicture);

// Cambio password y email de abogado
// POST - /lawyers/:idLawyer/email-password
app.post("/lawyers/:idLawyer/email-password", isLawyer, editLawyerPassword);

// Recuperación password abogado
// POST - /lawyers/recover-password
app.post("/lawyers/recover-password", recoverLawyerPassword);

// Resetear password abogado
// POST - /lawyers/reset-password/:recoverCode
app.post("/lawyers/reset-password/:recoverCode", resetLawyerPassword);

// Buscar abogados
// GET - /lawyers/search
app.get("/lawyers/search", searchLawyer);

// PROCESSES ENDPOINTS

// Abrir proceso
// POST - /users/:idUser/processes
app.post("/users/:idUser/processes/lawyers/:idLawyer", isUser, newProcess);

// Editar proceso por usuario
// PUT - /users/:idUser/processes/:idProcess/edit
app.put(
  "/users/:idUser/processes/:idProcess/edit",
  isUser,
  processExists,
  editProcess
);

// Editar proceso por abogado
// PUT - /lawyers/:idLawyer/processes/:idProcess/edit
app.put(
  "/lawyers/:idLawyer/processes/:idProcess/edit",
  isLawyer,
  processExists,
  editProcess
);

// Borrar proceso por usuario o admin
// PUT - /users/:idUser/processes/:idProcess/delete
app.put(
  "/users/:idUser/processes/:idProcess/delete",
  isUser,
  processExists,
  deleteProcess
);

// Listar un proceso determinado por usuario
// GET - /users/:idUser/processes/:idProcess
app.get(
  "/users/:idUser/processes/:idProcess",
  isUser,
  processExists,
  getProcesss
);

// Listar un proceso determinado por abogado
// GET - /lawyers/:idLawyer/processes/:idProcess
app.get(
  "/lawyers/:idLawyer/processes/:idProcess",
  isLawyer,
  processExists,
  getProcesss
);

// Listar procesos por usuario
// GET - /users/:idUsers/list/processes
app.get("/users/:idUser/list/processes", isUser, listProcess);

// Listar procesos por abogado
// GET - /lawyers/:idLawyer/list/processes
app.get("/lawyers/:idLawyer/list/processes", isLawyer, listProcess);

// BUDGETS ENDPOINTS

// Añadir presupuesto por abogado
// POST - /lawyers/:idLawyer/processes/:idProcess/budgets
app.post(
  "/lawyers/:idLawyer/processes/:idProcess/budgets",
  isLawyer,
  processExists,
  newBudget
);

// Editar presupuesto por usuario
// PUT - /users/:idUser/processes/:idProcess/budgets/:idBudget/edit
app.put(
  "/users/:idUser/processes/:idProcess/budgets/:idBudget/edit",
  isUser,
  processExists,
  budgetExists,
  editBudget
);

// Editar presupuesto por abogado
// PUT - /lawyers/:idLawyer/processes/:idProcess/budgets/:idBudget/edit
app.put(
  "/lawyers/:idLawyer/processes/:idProcess/budgets/:idBudget/edit",
  isLawyer,
  processExists,
  budgetExists,
  editBudget
);

// Borrar presupuesto por abogado
// PUT - /lawyers/:idLawyer/processes/:idProcess/budgets/:idBudget/delete
app.put(
  "/lawyers/:idLawyer/processes/:idProcess/budgets/:idBudget/delete",
  isLawyer,
  processExists,
  budgetExists,
  deleteBudget
);

// Listar presupuesto determinado por usuario
// GET - /user/:idUser/process/:idProcess
app.get("/users/:idUser/process/:idProcess", isUser, getBudget);

// Listar presupuesto determinado por abogado
// GET - /lawyers/:idLawyers/process/:idProcess
app.get("/lawyers/:idLawyer/process/:idProcess", isLawyer, getBudget);

// Puntuar por usuario
// PUT - /users/:idUser/processes/:idProcess/budgets
app.put(
  "/users/:idUser/processes/:idProcess/budgets",
  isUser,
  processExists,
  rating
);

// Listar puntuación
// GET- /lawyers/:idLawyer/list-rating
app.get("/lawyers/:idLawyer/list-rating", listRating);

// SPECIALITIES ENDPOINTS

// Añadir nueva especialidad por abogado
// POST - /lawyers/:idLawyer/specilities
app.post("/lawyers/:idLawyer/specialities", isLawyer, addNewSpeciality);

// Borrar una especialidad por abogado
// DELETE - /lawyers/:idLawyer/specialities/:idSpeciality
app.delete(
  "/lawyers/:idLawyer/specialities/:idSpeciality",
  isLawyer,
  deleteSpeciality
);

// Error middleware
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: `error`,
    message: error.message,
  });
});

// Not found middleware
app.use((req, res) => {
  res.status(404).send({
    status: `error`,
    message: `Not found`,
  });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Legal Shield funcionando en http://localhost:${port} 😎`);
});
