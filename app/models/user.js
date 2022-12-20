const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Meio que um middleware para fazer o hash da senha, para que ela fique salva criptografada no banco de dados
UserSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    bcrypt.hash(this.password, 10, (error, hashedPassword) => {
      if (error) next(error);
      else {
        this.password = hashedPassword;
        next();
      }
    });
  }
});

UserSchema.methods.passwordAuthentication = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, same) {
    if (err) callback(err);
    else {
      callback(err, same);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
