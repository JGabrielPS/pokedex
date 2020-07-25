const connection = require("../dbConnection");

module.exports = (req, res, next) => {
  const { user, order, name } = req.body;
  const query = `SELECT COUNT(pokemon_order) as 'count' FROM collections WHERE user_id = ${user} AND pokemon_order = ${order}`;
  connection.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    else {
      const count = JSON.parse(JSON.stringify(rows))[0].count;
      if (count > 1) {
        return res.status(409).send(`${name}`);
      } else {
        next();
      }
    }
  });
};
