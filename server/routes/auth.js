const express = require("express");
const router = express.Router();
const redirectAuthenticated = require("../middleware/redirectAuthenticated");

router
  .get("/register", redirectAuthenticated, (req, res) => {
    let context = {pageTitle: "Registro de usuario - Pokedex"};
    console.log(req.session.errors, context);
    if (req.session.errors) {
      context.param = req.session.errors.param;
      context.msg = req.session.errors.msg;
      delete req.session.errors;
    }
    res.render("register", context);
  })
  .get("/login", redirectAuthenticated, (req, res) => {
    let context = {pageTitle: "Login de usuario - Pokedex"};
    console.log(req.session.errors, context);
    if (req.session.errors) {
      context.param = req.session.errors.param;
      context.msg = req.session.errors.msg;
      delete req.session.errors;
    }
    res.render("login", context);
  })
  .get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

module.exports = router;
