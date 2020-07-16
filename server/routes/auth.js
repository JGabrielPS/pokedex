const express = require("express");
const router = express.Router();

router
  .get("/register", (req, res) => {
    res.render("register");
  })
  .get("/login", (req, res) => {
    res.render("login");
  })
  .get("/logout", (req, res) => {
    res.send("Prueba de ruta de logout: OK");
  });

module.exports = router;
