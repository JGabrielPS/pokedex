const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

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
  .post("/savePokemon", (req, res) => {
    if (Object.keys(req.body).length != 0) {
      const { id, order, name } = req.body;
      query = `INSERT INTO collections(pokemon_order, pokemon_name, user_id) VALUES (${order}, '${name}', ${id})`;
      connection.query(query, (err, rows) => {
        if (err) return res.status(500).json(err);
        return res.status(200).send("Se Guardo con Exito el Pokemon");
      });
    } else {
      res.status(400).send("Objeto vacio");
    }
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
