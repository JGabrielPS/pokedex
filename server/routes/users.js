const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.json({message: "welcome"})
});

router.post('/saveFavouritesPokemons', (req, res) => {
  if(Object.keys(req.body).length != 0){
    res.status(200).send("Objeto recibido")
  }else{
    res.status(400).send("Objeto vacio")
  }
})

module.exports = router;
