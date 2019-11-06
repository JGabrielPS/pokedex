const express = require('express');
const router = express.Router();

const mysqlConnection = require('../dbConnection');
let query = "";

const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.json({message: "welcome"})
});

router.post('/guardarPokemonsFavoritos', (req, res) => {
  if(Object.keys(req.body).length != 0){
    query = `CREATE TABLE IF NOT EXISTS favourites { 'user' varchar(50) NOT NULL,}`;
    mysqlConnection.query();
  }else{
    return res.status(400).send("No se envio ninguna informacion");
  }
});

module.exports = router;
