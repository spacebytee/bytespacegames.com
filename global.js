import { endpoints } from '/api_endpoints.js';
console.log("before navbar runs, userData:", localStorage.getItem("userData"));
let navbarDiv;
let navbarLeft;
let navbarRight;
let userData;
let userLink;
let profileBtn;
let logoutBtn;
let dropdownVisible = false;

document.addEventListener("DOMContentLoaded", function () {
    navbarDiv = document.getElementById("navbar");
    navbarLeft = document.createElement("div");
    navbarLeft.id = "navbar-left";
    navbarDiv.appendChild(navbarLeft);

    navbarRight = document.createElement("div");
    navbarRight.id = "navbar-right";
    navbarDiv.appendChild(navbarRight);
    setupNavbarRight();
    createDropdown();

    fetch("navbar.html")
    .then(response => response.text())
    .then(html => {
        navbarLeft.innerHTML = html;
    });

    document.addEventListener("click", (e) => {
        if (!navbarRight.contains(e.target) && !profileBtn.contains(e.target) && !logoutBtn.contains(e.target)) {
            hideDropdown();
        }
    });
    window.addEventListener("resize", () => {
        if (dropdownVisible) showDropdown();
    });
    window.addEventListener("scroll", () => {
        if (dropdownVisible) showDropdown();
    });
});

async function setupNavbarRight() {
    userData = JSON.parse(localStorage.getItem("userData") || "{}");
    let now = Date.now();
    let freshToken = userData.token && userData.lastValidated && now - userData.lastValidated < 24 * 60 * 60 * 1000;
    if (freshToken) {
        addAccount();
        return;
    }
    if (userData.token) {
        let validToken = await validateToken();
        userData = JSON.parse(localStorage.getItem("userData") || "{}");
        if (validToken) {
            addAccount();
            return;
        }
    }
    addRegisterLogin();
}
function addRegisterLogin() {
    navbarRight.innerHTML = `
        <a href="/register" class="link">register</a>
        <a href="/login" class="link">login</a>
    `;
}
function createDropdown() {
    profileBtn = document.createElement("a");
    profileBtn.className = "bytebtn";
    profileBtn.textContent = "your profile";
    profileBtn.href = "/profile";
    profileBtn.style.position = "fixed";
    profileBtn.style.display = "none";
    profileBtn.style.zIndex = "200";

    logoutBtn = document.createElement("button");
    logoutBtn.className = "bytebtn";
    logoutBtn.textContent = "logout";
    logoutBtn.style.position = "fixed";
    logoutBtn.style.display = "none";
    logoutBtn.style.zIndex = "200";

    document.body.appendChild(profileBtn);
    document.body.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', logout);
}
function showDropdown() {
    dropdownVisible = true;
    profileBtn.style.display = "block";
    logoutBtn.style.display = "block";

    profileBtn.style.right = "0px";
    profileBtn.style.top = `${navbarDiv.getBoundingClientRect().bottom}px`;
    logoutBtn.style.right = "0px";
    logoutBtn.style.top = `${profileBtn.getBoundingClientRect().bottom}px`;
}
function hideDropdown() {
    dropdownVisible = false;
    profileBtn.style.display = "none";
    logoutBtn.style.display = "none";
}
function addAccount() {
    navbarRight.innerHTML = "<a class=\"link\" id=\"user-link\">" + userData.username + "</a>";
    userLink = document.getElementById("user-link");
    userLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (dropdownVisible) hideDropdown();
        else showDropdown();
    });
}
async function validateToken() {
    try {
        const res = await fetch(endpoints.WHOAMI, {
            method: "GET",
            headers: {"Content-Type": "application/json", "token": userData.token}
        });
        let now = Date.now();
    
        if (!res.ok) {
            //localStorage.removeItem("userData");
            console.warn("token validation failed");
            return false;
        }

        const data = await res.json();
        if (!userData.username || !username.uuid) {
            throw new Error("Invalid JSON");
        }
        userData.lastValidated = now;
        userData.username = data.username;
        userData.uuid = data.uuid;
        localStorage.setItem("userData", JSON.stringify(userData));
        return true;
    } catch (err) {
        console.error("token validation failed:", err);
        return false;
    }
}
function logout() {
    fetch(endpoints.LOGOUT, {
        method: "POST",
        headers: {"Content-Type": "application/json", "token": userData.token}
    })
    .then(async(response) => {
        localStorage.removeItem("userData");
        location.reload();
    });
}