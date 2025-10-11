import { endpoints } from '/api_endpoints.js';

let rAll = false;
let passwordInput;
let emailInput;
let errorLabel;
let loginBtn;

document.addEventListener("DOMContentLoaded", () => {
    passwordInput = document.getElementById("password");
    emailInput = document.getElementById("email");
    errorLabel = document.getElementById("error");
    loginBtn = document.getElementById("login");

    passwordInput.addEventListener("input", clearError);
    emailInput.addEventListener("input", clearError);

    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }
});
function clearError() {
    errorLabel.innerHTML = "";
}
function isNullOrWhiteSpace(str) {
  if (str === null || str === undefined) {
    return true;
  }
  return String(str).trim() === '';
}
async function hash(message) {
  let msgBuffer = new TextEncoder().encode(message);
  let hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  let hashArray = Array.from(new Uint8Array(hashBuffer));
  let hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hexHash;
}
async function login() {
    if (isNullOrWhiteSpace(emailInput.value)) {
        errorLabel.innerHTML = "must input email";
        return;
    }
    if (isNullOrWhiteSpace(passwordInput.value)) {
        errorLabel.innerHTML = "must input password";
        return;
    }
    const payload = {
        hashedPassword: await hash(passwordInput.value),
        email: emailInput.value.trim()
    };
    fetch(endpoints.LOGIN, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })
    .then(async(response) => {
        if (response.ok) {
            let result = await response.json();
            let userData = {username: result.username, uuid: result.uuid, token: result.token, lastValidated: Date.now()};
            console.log("setting userdata: " + JSON.stringify(userData));
            localStorage.setItem("userData", JSON.stringify(userData));
            setTimeout(() => {
                window.location = "/index";
            }, 1000);
        } else {
            let em = await response.text();
            throw new Error(em);
        }
    })
    .catch((error) => {
        errorLabel.innerHTML = error.message
    });
}