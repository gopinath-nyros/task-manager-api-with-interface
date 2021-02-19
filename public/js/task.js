// script for tasks
// get id
const taskdescription = document.getElementById("taskdescription");
const status = document.getElementById("status");
const taskSubmit = document.getElementById("tasksubmit");
const taskTable = document.getElementById("tasktable");
const completed = document.getElementById("completed");
const taskbody = document.getElementById("taskbody");
let currentRow;
const titleMaxLength = 30;
const titleWarnLength = 25;
// helper
let task = document.querySelector(".task");
let checkstatus = document.querySelector(".checkstatus");

//event listener
taskSubmit.addEventListener("click", validateTask);
taskTable.addEventListener("click", editTask);
taskTable.addEventListener("click", deleteTask);
["keyup", "change", "keydown", "focus", "blur"].forEach(function (e) {
  taskdescription.addEventListener(e, taskdescriptionCounter);
});

function taskdescriptionCounter() {
  console.log(taskdescription.value.length);
  let count = taskdescription.value.length;

  if (count >= 1) {
    task.classList.remove("red-text");
    task.innerHTML = `${titleMaxLength - count} charecters left`;
  }

  if (count > titleMaxLength) {
    task.classList.remove("red-text");
    taskdescription.value = taskdescription.value.substring(0, titleMaxLength);
    count--;
  }
  if (count + 1 > titleWarnLength) {
    task.classList.add("red-text");
    task.innerHTML = `${titleMaxLength - count} charecters left`;
  }
}

function validateTask(e) {
  task.classList.add("red-text");
  e.preventDefault();
  if (e.target.textContent === "add") {
    if (!taskdescription.value) {
      taskdescription.focus();
      task.innerHTML = "enter some description";
      return false;
    } else if (taskdescription.value.length < 5) {
      task.classList.add("red-text");
      task.innerHTML = "minimum 5 charecters needed";
      return false;
    } else {
      postTask(taskdescription.value);
      task.innerHTML = "";
      taskdescription.value = "";
    }
  } else {
    task.classList.remove("red-text");
    if (!taskdescription.value) {
      taskdescription.focus();
      task.innerHTML = "enter some description";
      return false;
    } else if (taskdescription.value.length < 5) {
      // taskdescription.focus();
      task.classList.add("red-text");
      task.innerHTML = "min 5 charecters needed";
      return false;
    }
    if (status.value === "select status") {
      status.focus();
      checkstatus.innerHTML = "select status";
      return false;
    }
    updateTask(taskdescription.value, status.value);
    checkstatus.innerHTML = "";
    task.innerHTML = "";
    taskdescription.value = "";
    status[2].remove();
    status[0].selected = true;
    status[1].disabled = true;
    tasksubmit.innerHTML = `<i class="material-icons">add</i>`;
    tasksubmit.classList.replace("orange", "blue");
  }
}

async function postTask(description) {
  const data = { description };
  const url = "/tasks";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    keepalive: true,
  });
  const result = await response.json();
  if (response.status === 201) {
    window.location.href = "/tasks";
  } else {
    alert("unable to create task");
  }
}

function editTask(e) {
  if (e.target.classList.contains("edit")) {
    completed.disabled = false;
    task.innerHTML = "";
    tasksubmit.classList.replace("blue", "orange");
    tasksubmit.innerHTML = `<i class="material-icons">edit</i>`;
    // add new option to select
    if (status.value != "select status" && status.length === 2) {
      $("#status")
        .formSelect()
        .append(
          $("<option selected disabled>" + "select status" + "</option>")
        );
    }
    // get task id
    updateTaskID = e.target.parentElement.parentElement.id;
    // set default status as "select status" whenever clicked
    status.selectedIndex = 2;
    currentRow = e.target.parentElement.parentElement;
    const updateTask = currentRow.cells[1].textContent;
    taskdescription.focus();
    taskdescription.value = updateTask;
  }
}

async function updateTask(description, status) {
  console.log(`${description} and status is ${status}`);
  const completed = status === "completed" ? true : false;
  console.log(completed);
  const data = { completed, description };
  const url = `/tasks/${currentRow.id}`;
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    keepalive: true,
  });
  if (response.status === 200) {
    currentRow.cells[1].textContent = description;
    currentRow.cells[2].textContent = status;
  } else {
    alert("unable to update");
  }
}

async function deleteTask(e) {
  if (e.target.classList.contains("delete")) {
    const taskID = e.target.parentElement.parentElement.id;
    const deleteRow = e.target.parentElement.parentElement;
    const confirmation = window.confirm("are you sure to delete ?");
    if (confirmation) {
      const url = `/tasks/${taskID}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        keepalive: true,
      });
      if (response.status === 200) {
        const skip = window.location.search;
        console.log(skip);
        window.location.href = `/tasks`;
      } else {
        alert("unable to update");
      }
      if (taskbody.rows.length === 0) {
        taskbody.innerHTML = `<tr>
          <td colspan="7">No tasks found</td>
        </tr>`;
      }
    }
  }
}
