const connection = require("../dbConnection");

module.exports = (req, res, next) => {
  const { user } = req.body;
  query = `SELECT COUNT(pokemon_order) as 'count' FROM teams WHERE user_id = ${user}`;
  connection.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    else {
      const count = JSON.parse(JSON.stringify(rows))[0].count;
      if (count < 6) {
        next();
      } else {
        return res.status(409).send("El equipo esta lleno");
      }
    }
  });
};
