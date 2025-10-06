import { endpoints } from '/api_endpoints.js';

let url = new URL(window.location.href);
let token = url.searchParams.get("token");

if (!token) {
    window.location = "/index";
}

document.addEventListener("DOMContentLoaded", function () {
    fetch(endpoints.FINALIZE, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: token
    })
    .then(async (response) => {
        if (response.ok) {
          document.getElementById("authstatus").innerHTML = "congratulations! your account has successfully been created!";
        } else {
            let em = await response.text();
            throw new Error(em);
        }
    })
    .catch((error) => {
        document.getElementById("authstatus").innerHTML = error.message;
    });
});
