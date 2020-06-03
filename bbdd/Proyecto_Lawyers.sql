use Proyecto_Lawyers;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(12) UNIQUE,
    city VARCHAR(50) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    picture VARCHAR(100),
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

CREATE TABLE IF NOT EXISTS lawyers (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    law_firm VARCHAR(50) NOT NULL UNIQUE,
    street VARCHAR(50) NOT NULL,
    zip VARCHAR(5) NOT NULL,
    city VARCHAR(50) NOT NULL,
    phone_number VARCHAR(12) UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    picture VARCHAR(100),
    description TINYTEXT,
    urgency ENUM('Alta', 'Media', 'Baja') NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

CREATE TABLE IF NOT EXISTS processes (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    message VARCHAR(1000) NOT NULL,
    observations VARCHAR(300),
    status ENUM('Pendiente', 'Presupuestada', 'Pendiente de una resolución', 'Resuelta'),
    description VARCHAR(300),
    id_user INT UNSIGNED,
    FOREIGN KEY (id_user) REFERENCES users (id),
    id_lawyer INT UNSIGNED,
    FOREIGN KEY (id_lawyer) REFERENCES lawyers (id),
	creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

CREATE TABLE IF NOT EXISTS budgets (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    status ENUM('Pendiente', 'Aceptado', 'Rechazado'),
    message VARCHAR(500),
    price INT DEFAULT 0,
    rating DECIMAL(4,2),
    id_lawyer INT UNSIGNED,
    FOREIGN KEY (id_lawyer) REFERENCES lawyers (id),
    id_process INT UNSIGNED,
    FOREIGN KEY (id_process) REFERENCES processes (id),
	creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

CREATE TABLE IF NOT EXISTS specialities (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_lawyer INT UNSIGNED,
    FOREIGN KEY (id_lawyer) REFERENCES lawyers (id),
    speciality VARCHAR(50) NOT NULL
);

SET FOREIGN_KEY_CHECKS = 1;