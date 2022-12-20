var express = require("express");
var router = express.Router();
const User = require("../models/user");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_TOKEN;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  try {
    await user.save();
    res.status(200).send("Usuário cadastrado com sucesso.");
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Incorrect e-mail or password." });
    } else {
      user.passwordAuthentication(password, function (err, same) {
        if (!same)
          res.status(401).json({ error: "Incorrect e-mail or password." });
        else {
          const token = JWT.sign({ email }, secret, { expiresIn: "30d" });
          res.json({ user, token });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal error. Please, try again." });
  }
});

module.exports = router;
