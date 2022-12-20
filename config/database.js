const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost/evernote", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Conexão bem estabelecida"))
  .catch((err) => console.log(err));
