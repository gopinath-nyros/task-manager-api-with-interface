var mycanvas = document.getElementById("mycanvas");

var parentDiv = document.getElementById("bg");

let style = getComputedStyle(parentDiv);

let margintop = parseInt(style.marginTop);
let marginbottom = parseInt(style.marginBottom);
let paddingtop = parseInt(style.paddingTop);
let paddingbottom = parseInt(style.paddingBottom);
let content = parseInt(style.height);

var w, h;
h = mycanvas.height = parentDiv.offsetHeight;
w = mycanvas.width = parentDiv.offsetWidth;

var ctx = mycanvas.getContext("2d");

var mouse = {
  x: undefined,
  y: undefined,
};

var colors = [
  "#FAEBEB",
  "#FDE7E7",
  "#FFFAFA",
  "#FFFAFA",
  "#FFFAFA",
  "#F9EEEC",
  "#FAEDEB",
  "#FEEBE7",
  "#F8EFED",
  "#F8F3EC",
  "##EEF7F1",
  "##F0F5F2",
  "#F5FFFA",
  "#F4E5FF",
  "#FCE8FB",
];

window.addEventListener("resize", adjustWindow);

function adjustWindow() {
  h = mycanvas.height = parentDiv.offsetHeight;
  w = mycanvas.width = parentDiv.offsetWidth;
  init();
}

function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = "green";
    // ctx.stroke();
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  this.update = function () {
    if (this.x + radius > w || this.x - radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + radius > h || this.y - radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  };
}

var circleArr = [];

function init() {
  circleArr = [];
  // for loop
  for (i = 0; i < 200; i++) {
    var radius = Math.floor(Math.random() * 4 + 1);
    var x = Math.floor(Math.random() * (w - radius * 2) + radius);
    var y = Math.floor(Math.random() * (h - radius * 2) + radius);
    var dx = Math.random() - 0.5;
    var dy = Math.random() - 0.5;
    circleArr.push(new Circle(x, y, dx, dy, radius));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, w, h);

  for (i = 0; i < circleArr.length; i++) {
    circleArr[i].update();
  }
}

animate();
init();
