const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const handleEmptyBody = require("../middleware/handleEmptyBody");

const connection = require("../dbConnection");
let query = "";

router
  .get("/listPokemons/:user", (req, res) => {
    const { user } = req.params;
    console.log(user);
    query = `SELECT  pokemon_order, pokemon_name FROM teams WHERE user_id = ${user} GROUP BY pokemon_order`;
    connection.query(query, (err, rows) => {
      if (err) return res.status(500).json(err);
      let data = JSON.parse(JSON.stringify(rows));
      return res.status(200).json(data);
    });
  })
  .post("/savePokemon", handleEmptyBody, (req, res) => {
    const { user, order, name } = req.body;
    query = `INSERT INTO teams(user_id, pokemon_order, pokemon_name) VALUES (${user}, ${order}, '${name}')`;
    connection.query(query, (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).send(name);
    });
  })
  .delete("/deletePokemon/:user", handleEmptyBody, (req, res) => {
    const { order } = req.body;
    const { user } = req.params;
    query = `DELETE FROM collections WHERE pokemon_order=${order} AND user_id = ${user}`;
    connection.query(query, (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).send("se elimino exitosamente");
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
