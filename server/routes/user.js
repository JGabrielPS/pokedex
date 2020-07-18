const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const bcrypt = require("bcrypt");

const redirectAuthenticated = require("../middleware/redirectAuthenticated");
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../middleware/validateInputs");

const connection = require("../dbConnection");
let query = "";

router
  .post(
    "/register",
    redirectAuthenticated,
    registerValidationRules(),
    validate,
    (req, res) => {
      const { username, password } = req.body;

      bcrypt.hash(password, 10, (err, hash) => {
        query = `INSERT INTO users(user_name, user_password) VALUES ("${username}", "${hash}")`;
        connection.query(query, (err, result, rows) => {
          if (err) {
            const errMsg = Object.values(err)[2];
            return res.redirect("/auth/register");
          } else {
            res.redirect("/");
          }
        });
      });
    }
  )
  .post(
    "/login",
    redirectAuthenticated,
    loginValidationRules(),
    validate,
    (req, res) => {
      const { username, password } = req.body;
      const query = `SELECT user_id, user_name, user_password FROM users WHERE user_name = "${username}"`;
      connection.query(query, (err, rows) => {
        if (err) {
          return res.redirect("/auth/login");
        } else {
          const userId = JSON.parse(JSON.stringify(rows))[0].user_id;
          const userName = JSON.parse(JSON.stringify(rows))[0].user_name;
          const hash = JSON.parse(JSON.stringify(rows))[0].user_password;
          bcrypt.compare(password, hash, (error, same) => {
            if (same) {
              req.session.userId = userId;
              req.session.userName = userName;
              return res.redirect("/");
            } else {
              res.render("login", {
                param: "password",
                msg: "La contraseña no coincide"
              });
            }
          });
        }
      });
    }
  )

module.exports = router;
