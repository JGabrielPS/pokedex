const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pokedex",
});

connection.connect((error) => {
  if (error) {
    console.error(error);
    return;
  } else {
    console.log("Connected to the Data Base");
  }
});

const createUsers = `CREATE TABLE IF NOT EXISTS users(
  user_id INT(255) PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(50) NOT NULL UNIQUE,
  user_password VARCHAR(100) NOT NULL UNIQUE
)`;

const createCollection = `CREATE TABLE IF NOT EXISTS collections(
  pokemon_order INT(10) NOT NULL,
  pokemon_name VARCHAR(100) NOT NULL,
  user_id INT(255) NOT NULL,
  PRIMARY KEY (pokemon_order, user_id),
	CONSTRAINT FK_users FOREIGN KEY (user_id) REFERENCES users (user_id)
)`;

connection.query(createUsers, (error) => {
  if (error) {
    console.log("No se pudo crear la tabla users, " + error);
  } else {
    console.log("La tabla users esta creada");
  }
});

connection.query(createCollection, (error) => {
  if (error) {
    console.log("No se pudo crear la tabla collections, " + error);
  } else {
    console.log("La tabla collections esta creada");
  }
});

module.exports = connection;
