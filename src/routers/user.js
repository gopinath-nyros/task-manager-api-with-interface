const express = require("express");
const router = new express.Router();
// load sharp
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");

// load multer
const multer = require("multer");
// const { sendWelcomeEmail, cancelEmail } = require("../emails/account");

router.get("", (req, res) => {
  res.render("index");
});

// USERS
// endpoint for user create using async await
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // sendWelcomeEmail(user.email, user.name);
    // const token = await user.generateAuthToken();
    res
      .status(201)
      .send({ msg: "Registered successfully, please login to continue" });
  } catch (e) {
    res.status(400).send(e);
  }
});

// new route for login
router.post("/users/login", async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // coming from userSchema
    // res.send(user);
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({
      msg: "please provide valid credentials",
    });
  }
});

// route for logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    // filter particular token to logout
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
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

// end point for get user with auth
router.get("/users/me", auth, async (req, res) => {
  console.log(req.method);
  console.log(req.get("Content-Type"));
  console.log("calling get profile...");
  // console.log(req.body);
  // res.send(req.user);
  // console.log(req.user);
  // if (req.user) {
  res.render("dashboard", { user: req.user });
  // }

  // res.render("dashboard", { user: req.user });
  // res.redirect(200, "dashboard");
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

// endpoint for user resource delete with authentication
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    cancelEmail(req.user.email, req.user.name);
    res.send(req.user);
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
    res.send("success !");
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
