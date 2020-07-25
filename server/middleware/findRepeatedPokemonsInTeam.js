const connection = require("../dbConnection");

module.exports = (req, res, next) => {
  const { user, order, name } = req.body;
  const query = `SELECT COUNT(pokemon_order) as 'count' FROM teams WHERE user_id = ${user}`;
  connection.query(query, (err, rows) => {
    if (err) return res.status(500).json(err);
    else {
      const count = JSON.parse(JSON.stringify(rows))[0].count;
      if (count < 6) {
        console.log(name, count);    
        next();
      } else {
        console.log(name, count);
        return res.status(409).send(`${name}`);
      }
    }
  });
};
