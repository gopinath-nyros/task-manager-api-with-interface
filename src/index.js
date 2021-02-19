const express = require("express");
const app = express();
// connect to db
require("./db/mongoose");

app.use(express.static("public"));
app.set("view engine", "ejs");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// load path module
const path = require("path");

// path for public directory
publicDirectory = path.join(__dirname, "../public");

// path for views directory
viewsPath = path.join(__dirname, "../templates/views");
app.set("views", viewsPath);

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server is running...in the " + port);
});
