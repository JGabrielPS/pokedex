const express = require("express");
const router = express.Router();
const path = require("path");

router
  .get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../../ui/views/register.html"));
  })
  .get("/login", (req, res) => {
    res.send("Prueba de ruta de login: OK");
  })
  .get("/logout", (req, res) => {
    res.send("Prueba de ruta de logout: OK");
  });

module.exports = router;
