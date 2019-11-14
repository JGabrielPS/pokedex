const express = require("express");
const router = express.Router();

const connection = require("../dbConnection");

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.json({ message: "welcome" });
});

let query = "";

router.get("/listPokemons", (req, res) => {
  query = "SELECT * FROM Pokemons ORDER BY pokemon_id";
  connection.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    let datos = JSON.parse(JSON.stringify(rows));
    return res.status(200).json(datos);
  });
});

router.post("/saveFavouritesPokemons", (req, res) => {
  if (Object.keys(req.body).length != 0) {
    const { id, name } = req.body;
    console.log(id, name)
    query = `INSERT INTO Pokemons(Pokemons.pokemon_orden, Pokemons.pokemon_nombre) VALUES (${id}, '${name}')`;
    connection.query(query, (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).send("Pokemon Guardado con Exito");
    });
  } else {
    res.status(400).send("Objeto vacio");
  }
});

module.exports = router;
