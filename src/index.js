const express = require("express");
const app = express();
// connect to db
require("./db/mongoose");

// load the hbs
const hbs = require("hbs");
// load path module
const path = require("path");

// path for public directory
publicDirectory = path.join(__dirname, "../public");
app.set("view engine", "hbs");

// to serve static files
app.use(express.static(publicDirectory));

// path for views directory
viewsPath = path.join(__dirname, "../templates/views");
app.set("views", viewsPath);

// path for partials directory
partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath);

console.log(__dirname);
console.log(path.join(__dirname, "../public"));
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
// const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server is running...in the " + port);
});
