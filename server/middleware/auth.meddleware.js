const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.secrete);
      if (decoded) {
        req.username = decoded.username;
        req.userId = decoded.userId;
        next();
      } else {
        return res.status(400).json({ msg: "Wrong Cridentials" });
      }
    } else {
      return res.status(404).json({ msg: "Invalid Token" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = auth;
