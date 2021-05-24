const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer", "");
      const user = await User.findOne({ token: token });
      if (user) {
        req.user = user;
        next();
      } else {
        res
          .status(400)
          .json({ message: "Unauthorized : aucune correspondance" });
      }
    } else {
      res.status(400).json({ message: "Unauthorized : aucun token envoyé" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = isAuthenticated;
