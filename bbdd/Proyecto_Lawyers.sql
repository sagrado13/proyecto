use Proyecto_Lawyers;

SET FOREIGN_KEY_CHECKS = 0;

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
);

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
);

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

CREATE TABLE IF NOT EXISTS budgets(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	status_budget ENUM('pendiente', 'aceptado', 'rechazado') DEFAULT 'pendiente' NOT NULL,
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

CREATE TABLE IF NOT EXISTS specialities(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	id_lawyer INT UNSIGNED,
	FOREIGN KEY(id_lawyer) REFERENCES lawyers(id),
	speciality TINYTEXT NOT NULL
);


SET FOREIGN_KEY_CHECKS = 1;