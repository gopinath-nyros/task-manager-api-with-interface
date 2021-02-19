const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const authcookie = req.cookies.authcookie;
    // check for valid token or not
    const decoded = jwt.verify(authcookie, process.env.JWT_SECRET);
    // if valid token then check in db
    // find user with correct id with authentication token still stored
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": authcookie,
    });

    // if no user found
    if (!user) {
      throw new Error();
    }

    //set the user that we found
    req.user = user;

    // call next

    next();
  } catch (e) {
    // res.status(401).send({ error: "please authenticate the token" });
    res.render("index", {
      error: "please authenticate the token",
      title: "Login",
      createdBy: "Gopinath",
    });
  }
};

module.exports = auth;
