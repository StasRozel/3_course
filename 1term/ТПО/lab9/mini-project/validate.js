const usernameError = document.getElementById("username-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");

export function submitForm(
    isUsernameValid,
    isEmailValid,
    isPasswordValid,
    isConfirmPasswordValid
  ) {
  
    if (
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      return true;
    } else {
      return false;
    }
  }

export function validateUsername(username) {
    const usernameRegex = /^[А-Яа-яa-zA-Z_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      usernameError.textContent = 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores.';
      return false;
    } else {
      usernameError.textContent = '';
      return true;
    }
  }

export function validateEmail(email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      return false;
    } else {
      emailError.textContent = '';
      return true;
    }
  }

export function validatePassword(password) {
    if (password.length < 0) {
      passwordError.textContent = 'Password must be at least 8 characters long.';
      return false;
    } else {
      passwordError.textContent = '';
      return true;
    }
  }

export function validateConfirmPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
      confirmPasswordError.textContent = 'Passwords do not match.';
      return false;
    } else {
      confirmPasswordError.textContent = '';
      return true;
    }
  }