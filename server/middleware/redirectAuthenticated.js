module.exports = (req, res, next) => {
  if (req.session.userName) {
    return res.redirect("/");
  } else {
    next();
  }
};
