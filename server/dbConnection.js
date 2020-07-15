const mysql = require("mysql");

const createUsers = `CREATE TABLE IF NOT EXISTS users(
  userId INT(255) PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL UNIQUE
)`;

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

connection.query(createUsers, (error) => {
  if(error) console.log('No se pudo crear la tabla users, ' + error);
  console.log('La tabla users esta creada');
});

module.exports = connection;
