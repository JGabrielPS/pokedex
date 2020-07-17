const express = require("express");
const router = express.Router();
const redirectAuthenticated = require("../middleware/redirectAuthenticated");

let context = {};

router
  .get("/register", redirectAuthenticated, (req, res) => {
    context.pageTitle = "Registro de usuario - Pokedex";
    if (req.session.errors) {
      context.param = req.session.errors.param;
      context.msg = req.session.errors.msg;
    }
    res.render("register", context);
  })
  .get("/login", redirectAuthenticated, (req, res) => {
    context.pageTitle = "Login de usuario - Pokedex";
    if (req.session.errors) {
      context.param = req.session.errors.param;
      context.msg = req.session.errors.msg;
    }
    res.render("login", context);
  })
  .get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

module.exports = router;
