import { endpoints } from '/api_endpoints.js';

let rAll = false;
let passwordInput;
let usernameInput;
let emailInput;
let errorLabel;
let registerBtn;

document.addEventListener("DOMContentLoaded", () => {
    passwordInput = document.getElementById("password");
    usernameInput = document.getElementById("username");
    emailInput = document.getElementById("email");
    errorLabel = document.getElementById("error");
    registerBtn = document.getElementById("register");

    const requirements = document.getElementById("password-requirements");

    const positionBox = () => {
        const rect = passwordInput.getBoundingClientRect();
        requirements.style.left = rect.right + 10 + "px"; // 10px to the right
        requirements.style.top = rect.top + "px"; // align top
    };

    positionBox();
    window.addEventListener("resize", positionBox);
    window.addEventListener("scroll", positionBox);

    passwordInput.addEventListener("input", checkPasswordRequirements);
    emailInput.addEventListener("input", clearError);
    usernameInput.addEventListener("input", clearError);

    if (registerBtn) {
        registerBtn.addEventListener('click', register);
    }
});
function clearError() {
    errorLabel.innerHTML = "";
}
function checkPasswordRequirements(event) {
    const value = event.target.value;
    errorLabel.innerHTML = "";

    let r1 = value.length >= 8;
    const regExpU = /[A-Z]/;
    const regExpL = /[a-z]/;
    const regExpN = /\d/;
    const regExpS = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let r2 = regExpU.test(value);
    let r3 = regExpL.test(value);
    let r4 = regExpN.test(value);
    let r5 = regExpS.test(value);
    rAll = r1 && r2 && r3 && r4 && r5;

    document.getElementById("r1").style = "color: " + color(r1);
    document.getElementById("r2").style = "color: " + color(r2);
    document.getElementById("r3").style = "color: " + color(r3);
    document.getElementById("r4").style = "color: " + color(r4);
    document.getElementById("r5").style = "color: " + color(r5);
}

function color(req) {
    if (req) {
        return "#00ff00";
    }
    return "#ff0055";
}
function isNullOrWhiteSpace(str) {
  if (str === null || str === undefined) {
    return true;
  }
  return String(str).trim() === '';
}
function emailIsValid(email)
{
    if (!email.includes("@"))
    {
        return false;
    }
    let ends = email.split("@", 2);
    if (ends.length != 2)
    {
        return false;
    }
    let user = ends[0];
    let domain = ends[1];
    if (isNullOrWhiteSpace(user) || isNullOrWhiteSpace(domain))
    {
        return false;
    }
    if (!domain.includes('.') || domain.startsWith(".") || domain.endsWith("."))
    {
        return false;
    }
    return true;
}

function register() {
    if (!rAll) {
        errorLabel.innerHTML = "password requirements not met";
        return;
    }
    if (!emailIsValid(emailInput.value)) {
        errorLabel.innerHTML = "invalid email";
        return;
    }
    if (isNullOrWhiteSpace(usernameInput.value)) {
        errorLabel.innerHTML = "must input username";
        return;
    }
    const payload = {
        username: usernameInput.value.trim(),
        password: passwordInput.value,
        email: emailInput.value
    };
    fetch(endpoints.REGISTER, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })
    .then(async(response) => {
        if (response.ok) {
            let content = document.getElementById('content');
            content.innerHTML = '';
            
            const title = document.createElement("p");
            title.className = "title";
            title.textContent = "register";
            content.appendChild(title);
            const brDiv = document.createElement("div");
            brDiv.className = "break";
            content.appendChild(brDiv);
            const info = document.createElement("p");
            info.className = "info";
            info.textContent = await response.text();
            content.appendChild(info);
        } else {
            let em = await response.text();
            throw new Error(em);
        }
    })
    .catch((error) => {
        errorLabel.innerHTML = error.message
    });
}