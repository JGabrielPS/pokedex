module.exports = (req, res, next) => {
  if (Object.keys(req.body).length !== 0) {
    next();
  } else {
    res.status(400).send("Objeto vacio");
  }
};
