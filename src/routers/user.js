const express = require("express");
const router = new express.Router();
// load sharp
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const moment = require("moment");
// load multer
const multer = require("multer");
const { sendWelcomeEmail, cancelEmail } = require("../emails/account");

router.get("", (req, res) => {
  if (req.cookies.authcookie) {
    res.redirect("/dashboard");
  } else {
    res.render("index", {
      error: "",
      title: "Login",
      createdBy: "Gopinath",
    });
  }
});

router.get("/about", auth, (req, res) => {
  res.render("about", {
    activeClass: "active",
    title: "about",
    pagename: "about",
    createdBy: "Gopinath",
  });
});

// USERS
// endpoint for creating new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    res
      .status(201)
      .send({ msg: "Registered successfully, please login to continue" });
  } catch (e) {
    res.status(400).send(e);
  }
});

// route for login user
router.post("/users/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("authcookie", token, {
      maxAge: 86400000,
      httpOnly: true,
    });

    // coming from userSchema
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({
      msg: "please provide valid credentials",
    });
  }
});

// route for logout
router.get("/logout", auth, async (req, res) => {
  try {
    // filter particular token to logout
    const tokenToRemove = req.cookies.authcookie;
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== tokenToRemove;
    });
    await req.user.save();
    res.cookie("authcookie", "", { maxAge: 1 });
    res.redirect("/");
  } catch (e) {
    res.status(500).send();
  }
});

// route for logout all session
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    // clear token array
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/dashboard", auth, (req, res) => {
  res.render("dashboard", {
    moment: moment,
    user: req.user,
    title: "dashboard",
    pagename: "home",
    createdBy: "Gopinath",
  });
});

// end point for get individual user
router.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

// end point for update a single user using patch http method with authentication
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "email",
    "password",
    "confirmpassword",
    "age",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// endpoint for remove page
router.get("/settings", auth, async (req, res) => {
  res.render("settings", {
    user: req.user,
    title: "settings",
    pagename: "settings",
    createdBy: "Gopinath",
  });
});

// endpoint for user resource delete with authentication
router.delete("/removeaccount", auth, async (req, res) => {
  try {
    console.log(req.user);
    console.log("req method is " + req.method);
    await req.user.remove();
    res.cookie("authcookie", "", { maxAge: 1 });
    cancelEmail(req.user.email, req.user.name);
    res.send("deleted");
  } catch (e) {
    res.status(500).send;
  }
});

// new instance
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true);
  },
});
// router for file upload
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    console.log("uploading........img");
    // create a new buffer
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send({
      msg: "success",
      userid: req.user._id,
    });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// router for delete file upload
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

// serving the img files
router.get("/users/:id/avatar", async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  try {
    const user = await User.findById(req.params.id);
    console.log(user.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
