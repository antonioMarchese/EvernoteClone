require("dotenv").config();
const secret = process.env.JWT_TOKEN;
const JWT = require("jsonwebtoken");
const User = require("../models/user");

const WithAuth = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    res.status(401).json({ error: "Unauthorized request: no token provided" });
  JWT.verify(token, secret, (err, decode) => {
    if (err)
      res.status(401).json({ error: "Unauthorized request: invalid token" });
    req.email = decode.email;
    User.findOne({ email: decode.email })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => res.status(401).json({ err }));
  });
};

module.exports = WithAuth;
