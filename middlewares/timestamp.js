module.exports = (req, res, next) => {
  console.log("Response :- ", res);
  next();
};
