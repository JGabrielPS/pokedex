const express = require("express");
const router = express.Router();

const connection = require("../dbConnection");

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

let query = "";

router.get("/listPokemons", (req, res) => {
  query = "SELECT * FROM pokemon ORDER BY pokemon_order";
  connection.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    let datos = JSON.parse(JSON.stringify(rows));
    return res.status(200).json(datos);
  });
});

router.post("/saveFavouritePokemon", (req, res) => {
  if (Object.keys(req.body).length != 0) {
    const { id, name } = req.body;
    query = `INSERT INTO pokemon(pokemon_order, pokemon_name) VALUES (${id}, '${name}')`;
    connection.query(query, (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).send("Se Guardo con Exito el Pokemon");
    });
  } else {
    res.status(400).send("Objeto vacio");
  }
});

router.delete("/deletePokemonsList", (req, res) =>{
  query = `DELETE FROM pokemon`;
  connection.query(query, (err) => {
    if (err) return res.status(500).json(err);
    return res.status(200).send("Lista de pokemons eliminada con exito");
  });
});

module.exports = router;
