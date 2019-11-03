const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pokedex"
});

connection.connect(error => {
  if (error) {
    console.error(error);
    return;
  } else {
    console.log("Connected to the Data Base");
  }
});

module.exports = connection;
