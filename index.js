const express = require("express");
const db = require("./config/mongoose");

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true })); //middleware to parse incoming requests

//setting ejs as template engine
app.set("view engine", "ejs");
app.set("views", "./views");

//using express router
app.use("/", require("./routes/index"));

//stating the static cs,js,img files will be in assets folder
app.use(express.static("./assets"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error on port ${port}`);
    return;
  }

  console.log("Server is running on port ", port);
});
