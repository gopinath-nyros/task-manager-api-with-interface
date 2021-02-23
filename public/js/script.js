// script for create user and login
// login
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginSubmit = document.getElementById("loginsubmit");
const msg = document.getElementById("message");

// signup
const username = document.getElementById("username");
const signupEmail = document.getElementById("signupEmail");
const signupAge = document.getElementById("age");
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");
const signupMsg = document.getElementById("signup-msg");

// forms and event listeners
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
loginForm.addEventListener("submit", loginValidate);
signupForm.addEventListener("submit", signupValidate);

["keyup", "change", "keydown", "blur"].forEach(function (e) {
  signupPassword.addEventListener(e, passwordCheck);
});

["keyup", "change", "keydown", "blur"].forEach(function (e) {
  signupConfirmPassword.addEventListener(e, confirmPasswordCheck);
});
// helpers text
let helperLoginMail = document.querySelector(".login-mail");
let helperLoginPassword = document.querySelector(".login-password");
let helperUsername = document.querySelector(".signup-user");
let helperAge = document.querySelector(".signup-age");
let helperSignupEmail = document.querySelector(".signup-email");
let helperSignupPassword = document.querySelector(".signup-password");
let helperSignupConfirmPassword = document.querySelector(
  ".signup-con-password"
);

signupAge.onkeydown = function (e) {
  if (
    !(
      (e.keyCode > 95 && e.keyCode < 106) ||
      (e.keyCode > 47 && e.keyCode < 58) ||
      e.keyCode == 8
    )
  ) {
    return false;
  }
};

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
  } else if (loginPassword.value.length < 7) {
    helperLoginPassword.innerHTML =
      "length is too short, should be atleast 7 chars";
    loginEmail.focus();
    return false;
  } else if (loginPassword.value.length > 12) {
    helperLoginPassword.innerHTML =
      "length is too long, should be lesser than or equal to 12 chars";
    loginEmail.focus();
    return false;
  } else {
    helperLoginPassword.innerHTML = "";
  }
  loginSubmit.disabled = true;
  login(loginEmail.value, loginPassword.value);
}

function signupValidate(e) {
  formReset();
  e.preventDefault();
  if (!username.value) {
    helperUsername.innerHTML = "please enter username";
    username.focus();
    return false;
  } else if (username.value.length < 7) {
    helperUsername.innerHTML = "minimum length should be 7 chars";
    username.focus();
    return false;
  } else if (username.value.length > 15) {
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

  if (!signupAge.value) {
    helperAge.innerHTML = "please enter age";
    signupAge.focus();
    return false;
  } else if (Number(signupAge.value) <= 0) {
    helperAge.innerHTML = "please enter age above 0";
    signupAge.focus();
    return false;
  } else if (Number(signupAge.value) > 100) {
    console.log(typeof Number(signupAge.value));
    console.log(Number(signupAge.value) > 100);
    helperAge.innerHTML = "max age limit is 100";
    signupAge.focus();
    return false;
  } else {
    helperAge.innerHTML = "";
  }

  if (!signupPassword.value) {
    helperSignupPassword.innerHTML = "please enter password";
    signupPassword.focus();
    return false;
  } else if (signupPassword.value.length < 7) {
    console.log(signupPassword.value.length);
    helperSignupPassword.innerHTML =
      "length is too short, should be atleast 7 chars";
    signupPassword.focus();
    return false;
  } else if (signupPassword.value.length > 12) {
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

  // if (signupPassword.value != signupConfirmPassword.value) {
  //   helperSignupPassword.innerHTML = "password does not match confirm password";
  //   signupPassword.focus();
  //   return false;
  // }
  //  else {
  //   helperSignupPassword.innerHTML = "";
  // }
  // if (!confirmPasswordCheck(e)) {
  //   return false;
  // }

  passwordCheck();
  confirmPasswordCheck();

  if (passwordCheck() && confirmPasswordCheck()) {
    signup(
      username.value,
      signupEmail.value,
      signupAge.value,
      signupPassword.value,
      signupConfirmPassword.value
    );
  }
}

function passwordCheck(e) {
  if (signupPassword.value && signupConfirmPassword.value) {
    if (signupPassword.value != signupConfirmPassword.value) {
      // console.log("unmatch");
      helperSignupPassword.innerHTML =
        "password does not match confirm password";
      return false;
    } else {
      // console.log("match...");
      helperSignupPassword.innerHTML = "";
      return true;
    }
  }
}

function confirmPasswordCheck(e) {
  // console.log(signupConfirmPassword.value);
  if (signupPassword.value != signupConfirmPassword.value) {
    // console.log("unmatch");
    helperSignupPassword.innerHTML = "password does not match confirm password";
    return false;
  } else {
    // console.log("match...");
    helperSignupPassword.innerHTML = "";
    return true;
  }
}

function formReset() {
  signupMsg.innerHTML = "Don't have an account ?";
  signupMsg.classList.remove("green-text");
}

// login function
async function login(email, password) {
  const url = "/users/login";
  const loginData = { email, password };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    keepalive: true,
  });
  const data = await response.json();
  // console.log(data);
  if (data.msg) {
    loginSubmit.disabled = false;
    msg.classList.add("red-text");
    msg.innerHTML = data.msg;
  } else {
    msg.innerHTML = "Please login to continue";
    msg.classList.remove("red-text");
    loginEmail.value = "";
    loginPassword.value = "";
    getProfile();
  }
}

// get profile
async function getProfile() {
  const url = "/dashboard";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  location.assign("/dashboard");
}

// signup function
async function signup(name, email, age, password, confirmpassword) {
  const url = "/users";
  const signupData = { name, email, age, password, confirmpassword };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(signupData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const data = await response.json();
  console.log(data);
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
    signupAge.value = "";
    signupPassword.value = "";
    signupConfirmPassword.value = "";
  }
}
