const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const findRepeatedPokemons = require("../middleware/findRepeatedPokemons");
const handleEmptyBody = require("../middleware/handleEmptyBody");

const connection = require("../dbConnection");
let query = "";

router
  .get("/listPokemons", (req, res) => {
    query =
      "SELECT pokemon_order, pokemon_name FROM collections ORDER BY pokemon_order";
    connection.query(query, (err, rows) => {
      if (err) return res.status(500).json(err);
      let datos = JSON.parse(JSON.stringify(rows));
      return res.status(200).json(datos);
    });
  })
  .post("/savePokemon", findRepeatedPokemons, handleEmptyBody, (req, res) => {
    const { user, order, name } = req.body;
    query = `INSERT INTO collections(user_id, pokemon_order, pokemon_name) VALUES (${user}, ${order}, '${name}')`;
    connection.query(query, (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).send(name);
    });
  })
  .delete("/deletePokemon", (req, res) => {
    const id = req.body.id;
    query = `DELETE FROM pokemon WHERE pokemon_order=${id}`;
    connection.query(query, (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).send("El pokemon se elimino exitosamente");
    });
  })
  .delete("/deletePokemonsList", (req, res) => {
    query = `DELETE FROM pokemon`;
    connection.query(query, (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).send("Lista de pokemons eliminada con exito");
    });
  });

module.exports = router;
