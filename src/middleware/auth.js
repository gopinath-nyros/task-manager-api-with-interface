const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // to get the incoming token from header
    const token = req.header("Authorization").replace("Bearer ", "");
    // check for valid token or not
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // if valid token then check in db
    // find user with correct id with authentication token still stored
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    // if no user found
    if (!user) {
      throw new Error();
    }
    req.token = token;
    //set the user that we found
    req.user = user;
    // call next
    next();
    // console.log(token);
  } catch (e) {
    res.status(401).send({ error: "please authenticate the token" });
  }
};

module.exports = auth;
