// load mongoose
const mongoose = require("mongoose");
const validator = require("validator");

// schema for task
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//  data model for tasks
const Task = mongoose.model("Task", taskSchema);

// export user model
module.exports = Task;
