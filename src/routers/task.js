const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");
const moment = require("moment");

// TASKS
// endpoint for user create using async await
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save(task);
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// end point for get tasks array with auth
router.get("/tasks", auth, async (req, res) => {
  console.log("sortBy is...." + req.query.sortBy);
  const limit = req.query.limit || 5;
  const page = req.query.skip || 1;

  match = {};
  sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    console.log(sort);
  }
  console.log(req.query.sortBy);
  try {
    const query = await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(limit),
          skip: parseInt(limit * page - limit),
          sort,
        },
      })
      .execPopulate();

    const count = req.user.tasks.length;
    const totalCount = await Task.countDocuments({ owner: req.user.id });

    res.render("task", {
      tasks: req.user.tasks,
      moment: moment,
      createdBy: "Gopinath",
      pagename: "tasks",
      title: "tasks",
      current: page,
      limit,
      count,
      sort,
      match,
      totalCount,
      pages: Math.ceil(totalCount / limit),
    });
  } catch (e) {
    res.status(500).send();
  }
});

// end point for get individual task with auth
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// end point for update a single task using patch http method
router.patch("/tasks/:id", auth, async (req, res) => {
  console.log(req.body);
  const updates = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// endpoint for task resource delete
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send;
  }
});

module.exports = router;
