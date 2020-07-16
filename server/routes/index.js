const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  console.log(req.session);
  res.render("index", {
    pageTitle: "Pokedex",
    index: true,
  });
});

module.exports = router;
