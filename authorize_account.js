import { endpoints } from '/api_endpoints.js';

let url = new URL(window.location.href);
let token = url.searchParams.get("token");

if (!token) {
    window.location = "/index";
}

if (token === "complete") {
    document.getElementById("authstatus").innerHTML = "congratulations! your account has successfully been created!";
} else {
    fetch(endpoints.FINALIZE, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(token)
    })
    .then(async (response) => {
        if (response.ok) {
            let result = await response.json();
            if (!result.uuid || !result.username || !result.token) {
                throw new Error("Invalid response");
            }
            let userData = {username: result.username, uuid: result.uuid, token: result.token, lastValidated: Date.now()};
            console.log("setting userdata: " + JSON.stringify(userData));
            localStorage.setItem("userData", JSON.stringify(userData));
            document.getElementById("authstatus").innerHTML = "congratulations! your account has successfully been created!";
            setTimeout(() => {
                window.location = "/authorize_account?token=complete";
            }, 5000);
        } else {
            let em = await response.text();
            throw new Error(em);
        }
    })
    .catch((error) => {
        document.getElementById("authstatus").innerHTML = error.message;
    });
}