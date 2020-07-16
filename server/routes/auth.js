const express = require("express");
const router = express.Router();
const redirectAuthenticated = require("../middleware/redirectAuthenticated");

router
  .get("/register", redirectAuthenticated, (req, res) => {
    res.render("register");
  })
  .get("/login", redirectAuthenticated, (req, res) => {
    res.render("login");
  })
  .get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

module.exports = router;
