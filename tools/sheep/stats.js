let url = new URL(window.location.href);
let identifier = url.searchParams.get("username");
document.addEventListener("DOMContentLoaded", function () {
    fetch("https://hypixel.bytespacegames.com:5000/api/GetStats?identifier=" + identifier)
    .then(async (response) => {
        if (response.ok) {
          return response.json();
        }
        let em = await response.text();
        throw new Error(em);
    })
    .then(data => { 
        parseData(data);
    })
    .catch((error) => {
        document.getElementById("titlebar").innerHTML = error.message;
    });
});
function toPage(rank) {
    return 1 + Math.floor((rank-1)/10);
}
function parseData(data) {
    document.getElementById("titlebar").innerHTML = "stats - " + data.name;
    addRanking("Total", data.total, data.rankTotal, "leaderboards.html?type=total&page=" + toPage(data.rankTotal));
    addRanking("Grass", data.grass, data.rankGrass, "leaderboards.html?type=grass&page=" + toPage(data.rankGrass));
    addRanking("Logs", data.logs, data.rankLogs,"leaderboards.html?type=logs&page=" + toPage(data.rankLogs));
    addRanking("Plants", data.plants, data.rankPlants,"leaderboards.html?type=plants&page=" + toPage(data.rankPlants));
    addRanking("Kelp", data.kelp, data.rankKelp,"leaderboards.html?type=kelp&page=" + toPage(data.rankKelp));
}

function addRanking(title, score, rank, redir) {
    let container = document.getElementById("statscont");

    let line = document.createElement("div");
    line.className = "ranking-line";

    let textPart = document.createElement("span");
    textPart.textContent = `${title}: ${score.toLocaleString()}`;

    let rankPart = document.createElement("a");
    rankPart.textContent = `(#${rank})`;
    rankPart.className = "placement";
    rankPart.href = redir;

    line.appendChild(textPart);
    line.appendChild(rankPart);
    container.appendChild(line);
}

