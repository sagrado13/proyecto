"use strict";

// Variable de entorno
require("dotenv").config();

// Módulos necesarios
const { getConnection } = require("./bbdd");
const faker = require("faker/locale/es");
const { random } = require("lodash");

let connection;

async function main() {
  try {
    // Conexión a la bbdd
    connection = await getConnection();

    // Borramos las tablas si existen
    console.log("Borrando tablas");
    await connection.query("DROP TABLE IF EXISTS budgets");
    await connection.query("DROP TABLE IF EXISTS processes");
    await connection.query("DROP TABLE IF EXISTS specialities");
    await connection.query("DROP TABLE IF EXISTS users");
    await connection.query("DROP TABLE IF EXISTS lawyers");

    // Creamos las tablas de nuevo
    await connection.query(`
      CREATE TABLE users (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        city_user VARCHAR(50) NOT NULL,
        phone_number_user VARCHAR(12) UNIQUE,
        login_user VARCHAR(50) NOT NULL UNIQUE,
        email_user VARCHAR(50) NOT NULL UNIQUE,
        password TINYTEXT NOT NULL,
        picture_user VARCHAR(100),
        role ENUM('normal', 'admin') DEFAULT 'normal' NOT NULL, 
        low_reason TINYTEXT,
        active BOOLEAN DEFAULT false,
        registration_code TINYTEXT,
        creation_date DATETIME NOT NULL,
        update_date DATETIME NOT NULL,
        last_auth_update DATETIME NOT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS lawyers (
	      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        law_firm VARCHAR(50) NOT NULL UNIQUE,
        street TINYTEXT NOT NULL,
        zip VARCHAR(5) NOT NULL,
        city_lawyer VARCHAR(50) NOT NULL,
        phone_number_lawyer VARCHAR(12) UNIQUE,
        login_lawyer VARCHAR(50) NOT NULL UNIQUE,
        email_lawyer VARCHAR(50) NOT NULL UNIQUE,
        password TINYTEXT NOT NULL,
        picture_lawyer VARCHAR(100),
        low_reason TINYTEXT,
        active BOOLEAN DEFAULT false,
        registration_code TINYTEXT,
        description TINYTEXT,
        urgency ENUM('alta', 'media', 'baja') DEFAULT 'media' NOT NULL,
        creation_date DATETIME NOT NULL,
        update_date DATETIME NOT NULL,
        last_auth_update DATETIME NOT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS processes(
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          message_process TEXT NOT NULL,
          observations VARCHAR(300),
          status_process ENUM('pendiente de presupuesto', 'presupuestado', 'presupuesto rechazado', 'pendiente de una resolución', 'resuelto') DEFAULT 'pendiente de presupuesto' NOT NULL,
          active BOOLEAN DEFAULT true,
          id_user INT UNSIGNED,
          FOREIGN KEY(id_user) REFERENCES users(id),
          id_lawyer INT UNSIGNED,
          FOREIGN KEY(id_lawyer) REFERENCES lawyers(id),
          creation_date DATETIME NOT NULL,
          update_date DATETIME NOT NULL
      );
      `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS budgets(
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          status_budget ENUM('pendiente de respuesta', 'aceptado', 'rechazado') DEFAULT 'pendiente de respuesta' NOT NULL,
          message_budget TEXT NOT NULL ,
          price INT NOT NULL,
          rating INT,
          opinion TINYTEXT,
          id_lawyer INT UNSIGNED,
          FOREIGN KEY(id_lawyer) REFERENCES lawyers(id),
          id_process INT UNSIGNED,
          FOREIGN KEY(id_process) REFERENCES processes(id),
          creation_date DATETIME NOT NULL,
          update_date DATETIME NOT NULL
      );
      `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS specialities(
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          id_lawyer INT UNSIGNED,
          FOREIGN KEY(id_lawyer) REFERENCES lawyers(id),
          speciality TINYTEXT NOT NULL
      );
      `);

    // Creamos admin

    console.log(`Creando administrador`);

    await connection.query(
      `
        INSERT INTO users(name, surname, city_user, login_user, email_user, password, role, active, creation_date, update_date, last_auth_update)
        VALUES('Iñaki', 'González Vázquez', 'Lugo', 'igonvaz', 'legalshield5.33@gmail.com', SHA2('${process.env.DEFAULT_ADMIN_PASSWORD}', 512), 'admin', true, UTC_TIMESTAMP, UTC_TIMESTAMP, UTC_TIMESTAMP)
        `
    );

    // Introducir datos aleatorios de prueba

    console.log(`Insertando datos en users`);
    const users = 20;

    for (let i = 0; i < users; i++) {
      const name = faker.name.firstName();
      const surname = faker.name.lastName() + " " + faker.name.lastName();
      const emailUser = faker.internet.email();
      const phoneNumberUser = faker.phone.phoneNumber();
      const cityUser = faker.address.city();
      const loginUser = faker.internet.userName();
      const passwordUser = faker.internet.password();

      await connection.query(
        `
        INSERT INTO users(name, surname, email_user, phone_number_user, city_user, login_user, 
        password, creation_date, update_date, last_auth_update)
        VALUES(
          "${name}", 
          "${surname}", 
          "${emailUser}", 
          "${phoneNumberUser}", 
          "${cityUser}", 
          "${loginUser}", 
          SHA2("${passwordUser}", 512),
          UTC_TIMESTAMP, 
          UTC_TIMESTAMP,
          UTC_TIMESTAMP)
        `
      );
    }

    console.log(`Insertando datos en lawyers`);
    const lawyers = 20;

    for (let i = 0; i < lawyers; i++) {
      const lawFirm = faker.company.companyName();
      const street = faker.address.streetAddress();
      const zip = faker.address.zipCode();
      const cityLawyer = faker.address.city();
      const phoneNumberLawyer = faker.phone.phoneNumber();
      const emailLawyer = faker.internet.email();
      const loginLawyer = faker.internet.userName();
      const passwordLawyer = faker.internet.password();

      await connection.query(
        `
        INSERT INTO lawyers(law_firm, street, zip, city_lawyer, phone_number_lawyer, email_lawyer, 
        login_lawyer, password, creation_date, update_date, last_auth_update)
        VALUES(
          "${lawFirm}", 
          "${street}", 
          "${zip}", 
          "${cityLawyer}", 
          "${phoneNumberLawyer}", 
          "${emailLawyer}", 
          "${loginLawyer}", 
          SHA2("${passwordLawyer}", 512), 
          UTC_TIMESTAMP,
          UTC_TIMESTAMP, 
          UTC_TIMESTAMP)
        `
      );
    }

    console.log(`Insertando datos en processes`);
    const processes = 30;

    for (let i = 0; i < processes; i++) {
      const messageProcess = faker.lorem.paragraphs();

      await connection.query(
        `
        INSERT INTO processes(message_process, id_user, id_lawyer, creation_date, update_date)
        VALUES(
          "${messageProcess}", 
          "${random(1, users)}", 
          "${random(1, lawyers)}",
          UTC_TIMESTAMP, 
          UTC_TIMESTAMP)
        `
      );
    }

    console.log(`Insertando datos en budgets`);
    const budgets = 30;

    for (let i = 0; i < budgets; i++) {
      const messageBudget = faker.lorem.paragraphs();
      const price = faker.commerce.price();

      await connection.query(
        `
      INSERT INTO budgets(message_budget, price, rating, id_lawyer, id_process, creation_date, update_date)
      VALUES(
        "${messageBudget}", 
        "${price}", 
        "${random(1, 5)}", 
        "${random(1, lawyers)}", 
        "${random(1, processes)}", 
        UTC_TIMESTAMP, 
        UTC_TIMESTAMP)
      `
      );
    }

    console.log(`Insertando datos en specialities`);
    const specialities = [
      `Derecho Civil`,
      `Derecho Penal`,
      `Derecho Comercial`,
      `Derecho Laboral`,
      `Derecho Tributario`,
      `Derecho Constitucional`,
      `Derecho Administrativo`,
      `Derecho Intelectual`,
      `Derecho Ambiental`,
    ];

    for (let i = 0; i < lawyers; i++) {
      const speciality = Math.floor(Math.random() * specialities.length);
      const specialityLawyer = specialities[speciality];

      await connection.query(
        `
        INSERT INTO specialities(id_lawyer, speciality)
        VALUES(
          "${random(1, lawyers)}", 
          "${specialityLawyer}"
        )
        `
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log(`Proceso finalizado, conexión liberada`);
    if (connection) connection.release();
    process.exit();
  }
}

main();
