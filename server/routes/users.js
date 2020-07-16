const express = require("express");
const router = express.Router();

const connection = require("../dbConnection");

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const path = require("path");
const bcrypt = require("bcrypt");

let query = "";

router
  .post("/register", (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
      query = `INSERT INTO users(username, password) VALUES ("${username}", "${hash}")`;
      connection.query(query, (err, result, rows) => {
        if (err) {
          const errMsg = Object.values(err)[2];
          return res.redirect("/auth/register");
        }
        res.redirect("/");
      });
    });
  })
  .post("/login", (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT username, password FROM users WHERE username = "${username}"`;
    connection.query(query, (err, rows) => {
      if (err) {
        return res.redirect("/auth/login");
      } else {
        const hash = JSON.parse(JSON.stringify(rows))[0].password;
        bcrypt.compare(password, hash, (error, same) => {
          if (same) return res.redirect("/");
          res.redirect("/auth/login");
        });
      }
    });
  })
  .get("/listPokemons", (req, res) => {
    query = "SELECT * FROM pokemon ORDER BY pokemon_order";
    connection.query(query, (err, rows) => {
      if (err) return res.status(500).json(err);
      let datos = JSON.parse(JSON.stringify(rows));
      return res.status(200).json(datos);
    });
  })
  .post("/saveFavouritePokemon", (req, res) => {
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
