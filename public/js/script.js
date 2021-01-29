// login
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const msg = document.getElementById("message");

// signup
const username = document.getElementById("username");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");
const signupMsg = document.getElementById("signup-msg");

// forms and event listeners
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
loginForm.addEventListener("submit", loginValidate);
signupForm.addEventListener("submit", signupValidate);

// helpers text
let helperLoginMail = document.querySelector(".login-mail");
let helperLoginPassword = document.querySelector(".login-password");
let helperUsername = document.querySelector(".signup-user");
let helperSignupEmail = document.querySelector(".signup-email");
let helperSignupPassword = document.querySelector(".signup-password");
let helperSignupConfirmPassword = document.querySelector(
  ".signup-con-password"
);

// LOGIN
function loginValidate(e) {
  let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
  e.preventDefault();
  if (!loginEmail.value) {
    helperLoginMail.innerHTML = "please enter email";
    loginEmail.focus();
    return false;
  } else {
    helperLoginMail.innerHTML = "";
  }

  if (!loginPassword.value) {
    helperLoginPassword.innerHTML = "please enter password";
    loginEmail.focus();
    return false;
  } else if (loginPassword.value.length <= 7) {
    helperLoginPassword.innerHTML =
      "length is too short, should be atleast 7 chars";
    loginEmail.focus();
    return false;
  } else if (loginPassword.value.length >= 12) {
    helperLoginPassword.innerHTML =
      "length is too long, should be lesser than or equal to 12 chars";
    loginEmail.focus();
    return false;
  } else {
    helperLoginPassword.innerHTML = "";
  }
  login(loginEmail.value, loginPassword.value);
}

function signupValidate(e) {
  formReset();
  e.preventDefault();
  if (!username.value) {
    helperUsername.innerHTML = "please enter username";
    username.focus();
    return false;
  } else if (username.value.length <= 7) {
    helperUsername.innerHTML = "minimum length should be 7 chars";
    username.focus();
    return false;
  } else if (username.value.length >= 15) {
    helperUsername.innerHTML = "maximum length is 15 chars";
    username.focus();
    return false;
  } else {
    helperUsername.innerHTML = "";
  }

  if (!signupEmail.value) {
    helperSignupEmail.innerHTML = "please enter email";
    signupEmail.focus();
    return false;
  } else {
    helperSignupEmail.innerHTML = "";
  }

  if (!signupPassword.value) {
    helperSignupPassword.innerHTML = "please enter password";
    signupPassword.focus();
    return false;
  } else if (signupPassword.value.length <= 7) {
    console.log(signupPassword.value.length);
    helperSignupPassword.innerHTML =
      "length is too short, should be atleast 7 chars";
    signupPassword.focus();
    return false;
  } else if (signupPassword.value.length >= 12) {
    helperSignupPassword.innerHTML =
      "length is too long, should be lesser than or equal to 12 chars";
    signupPassword.focus();
    return false;
  } else {
    helperSignupPassword.innerHTML = "";
  }

  if (!signupConfirmPassword.value) {
    helperSignupConfirmPassword.innerHTML = "please enter confirm password";
    signupConfirmPassword.focus();
    return false;
  } else {
    helperSignupConfirmPassword.innerHTML = "";
  }

  if (signupPassword.value != signupConfirmPassword.value) {
    helperSignupPassword.innerHTML = "password does not match confirm password";
    signupPassword.focus();
    return false;
  } else {
    helperSignupPassword.innerHTML = "";
  }
  signup(
    username.value,
    signupEmail.value,
    signupPassword.value,
    signupConfirmPassword.value
  );
}

function formReset() {
  signupMsg.innerHTML = "Don't have an account ?";
  signupMsg.classList.remove("green-text");
}

// login function
async function login(email, password) {
  const url = "http://localhost:3000/users/login";
  const loginData = { email, password };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const data = await response.json();
  console.log(data);
  // console.log(data.token);
  // console.log(typeof data.token);
  localStorage.setItem("token", data.token);
  const localToken = localStorage.getItem("token");

  if (data.msg) {
    msg.classList.add("red-text");
    msg.innerHTML = data.msg;
  } else {
    msg.innerHTML = "Please login to continue";
    msg.classList.remove("red-text");
    loginEmail.value = "";
    loginPassword.value = "";
    getProfile(localToken);
  }
}

// get profile
async function getProfile(token) {
  const url = "http://localhost:3000/users/me";

  // const data = {token};
  const response = await fetch(url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    // body: JSON.stringify(data),
    headers: {
      Authorization: "Bearer " + token,
      // "Content-type": "application/json; charset=UTF-8",
    },
    // redirect: "follow",
    // keepalive: true,
  });
  console.log(response);
}

// signup function
async function signup(name, email, password, confirmpassword) {
  const url = "http://localhost:3000/users";
  const signupData = { name, email, password, confirmpassword };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(signupData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const data = await response.json();
  console.log(data);
  // console.log(data.msg);
  // console.log(data.errors);
  // console.log(data.errors.email);
  // console.log(data.errors.email.message);
  if (data.errors) {
    if (data.errors.email) {
      helperSignupEmail.innerHTML = data.errors.email.message;
      return false;
    }
  } else {
    signupMsg.innerHTML = data.msg;
    signupMsg.classList.add("green-text");
    helperSignupEmail.innerHTML = "";
    username.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
    signupConfirmPassword.value = "";
  }
}
