const { body, validationResult } = require("express-validator");

const registerValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("El nombre de usuario no puede estar vacio")
      .isLength({ min: 3, max: 50 })
      .withMessage("El valor del campo debe ser de 8 a 50 caracteres"),
    body("password")
      .notEmpty()
      .withMessage("El password no puede estar vacio")
      .isLength({ min: 4, max: 50 })
      .withMessage("El valor del campo debe ser de 8 a 50 caracteres"),
  ];
};

const loginValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("El nombre de usuario no puede estar vacio"),
    body("password").notEmpty().withMessage("El password no puede estar vacio"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    console.log(errors);
    req.session.errors = errors[0];
    return res.redirect(`/auth${req.url}`);
  } else {
    next();
  }
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate,
};
