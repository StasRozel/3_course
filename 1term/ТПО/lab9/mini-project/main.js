import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  submitForm,
} from "./validate.js";

const form = document.getElementById("registration-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");



function isValid() {
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  const isUsernameValid = validateUsername(username);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = validateConfirmPassword(
    password,
    confirmPassword
  );

  return [
    isUsernameValid,
    isEmailValid,
    isPasswordValid,
    isConfirmPasswordValid,
  ];
}

document.querySelector("button").addEventListener("click", () => {
  console.log("click");
  const valid = isValid();
  console.log(submitForm(valid[0], valid[1], valid[2], valid[3]))
});
