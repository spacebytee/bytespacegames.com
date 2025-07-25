let url = new URL(window.location.href);
let page = url.searchParams.get("page");
let type = url.searchParams.get("type");
let maxPages = 2;
document.addEventListener("DOMContentLoaded", function () {
    fetch("https://api.bytespacegames.com:5000/api/GetLeaderboard?type=" + type + "&page=" + page)
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

function parseData(data) {
    document.getElementById("titlebar").innerHTML = "leaderboards - " + type.toLowerCase().trim();
    maxPages = data.pagecount;
    addTabs();
    for (const item of data.data) {
        addRanking(item.name,item.amount,item.position,item.rank,"stats.html?username=" + item.uuid, item.rankColor, item.plusColor);
    }
    addButtons();
}

function addRanking(name, score, position, rank, redir, rankColor, plusColor) {
    let container = document.getElementById("statscont");

    let line = document.createElement("div");
    line.className = "ranking-line";

    let textPart = document.createElement("a");
    textPart.className = "player";
    textPart.href = redir;

    let { rankElement, nameColor } = formatRank(rank, name, rankColor, plusColor);

    textPart.appendChild(document.createTextNode(position + ". "));
    textPart.appendChild(rankElement);

    let nameSpan = document.createElement("span");
    nameSpan.textContent = " " + name;
    nameSpan.style.color = nameColor;
    textPart.appendChild(nameSpan);

    let valPart = document.createElement("span");
    valPart.textContent = score;
    valPart.className = "value";

    line.appendChild(textPart);
    line.appendChild(valPart);
    container.appendChild(line);
}
function createTabBtn(text, tab) {
    let totalBtn = document.createElement("a");
    totalBtn.textContent = text;
    totalBtn.className = "player";
    totalBtn.id = "bluehover";
    totalBtn.href = "leaderboards.html?type=" + tab + "&page=1";
    if (type.toLowerCase().trim() === tab) {
        totalBtn.style = "color:#ff0055;"
    }
    return totalBtn;
}
function addTabs() {
    let container = document.getElementById("statscont");

    let line = document.createElement("div");
    line.className = "ranking-line";
    line.style = "margin-bottom:5px; justify-content:space-evenly;";

    let totalBtn = createTabBtn("Total","total");
    let grassBtn = createTabBtn("Grass","grass");
    let logsBtn = createTabBtn("Logs","logs");
    let plantsBtn = createTabBtn("Plants","plants");
    let kelpBtn = createTabBtn("Kelp","kelp");

    line.appendChild(totalBtn);
    line.appendChild(grassBtn);
    line.appendChild(logsBtn);
    line.appendChild(plantsBtn);
    line.appendChild(kelpBtn);
    container.appendChild(line);
}

function addButtons() {
    let container = document.getElementById("statscont");

    let line = document.createElement("div");
    line.className = "ranking-line";
    line.style = "margin-top:5px";

    let leftPart = document.createElement("a");
    leftPart.textContent = "< Back";
    leftPart.className = "player";
    leftPart.id = "bluehover";
    leftPart.href = "leaderboards.html?type=" + type + "&page=" + (page - 1);

    let rightPart = document.createElement("a");
    rightPart.textContent = "Next >";
    rightPart.className = "value";
    rightPart.id = "bluehover";
    //TODO: MAKE THESE WORK
    rightPart.href = "leaderboards.html?type=" + type + "&page=" + (Number(page) + 1);

    if (page > 1) {
        line.appendChild(leftPart);
    } else {
        leftPart = document.createElement("a");
        line.appendChild(leftPart);
    }
    if (page < maxPages) {
        line.appendChild(rightPart);
    }
    container.appendChild(line);
}

function formatRank(rank, name, rankColor, plusColor) {
    let rankSpan = document.createElement("span");
    let nameColor = "#FFFFFF"; // Default white
    if (rank === "-" || rank === "NORMAL") {
        nameColor = "#AAAAAA";
    } else if (rank === "VIP") {
        rankSpan.textContent = "[VIP]";
        rankSpan.style.color = "#00ff00";
        nameColor = "#00ff00";
    } else if (rank === "MVP") {
        rankSpan.textContent = "[MVP]";
        rankSpan.style.color = "#00ffff";
        nameColor = "#00ffff";
    } else if (rank === "VIP+") {
        rankSpan.innerHTML = "[VIP";
        rankSpan.style.color = "#00ff00";

        let plusSpan = document.createElement("span");
        plusSpan.textContent = "+";
        plusSpan.style.color = "#FFD700"; // Gold

        let endSpan = document.createElement("span");
        endSpan.textContent = "]";

        rankSpan.appendChild(plusSpan);
        rankSpan.appendChild(endSpan);
        nameColor = "#00ff00";
    } else if (rank.startsWith("MVP+")) {
        let baseColor = rank === "MVP++" && rankColor != "AQUA" ? "#FFD700" : "#00ffff";

        rankSpan.innerHTML = "[MVP";
        rankSpan.style.color = baseColor;

        let plusSpan = document.createElement("span");
        plusSpan.textContent = rank.substring(3); // "+", "++"
        plusSpan.style.color = getMinecraftColor(plusColor);

        let endSpan = document.createElement("span");
        endSpan.textContent = "]";
        
        rankSpan.appendChild(plusSpan);
        rankSpan.appendChild(endSpan);
        
        nameColor = baseColor;
    } else if (rank === "GM") {
        rankSpan.textContent = "[GM]";
        rankSpan.style.color = "#00AA00";
        nameColor = "#00AA00";
    } else if (rank === "ADMIN") {
        rankSpan.textContent = "[ADMIN]";
        rankSpan.style.color = "#FF5555";
        nameColor = "#FF5555";
    } else {
        rankSpan.textContent = rank;
    }

    return { rankElement: rankSpan, nameColor };
}

// Function to convert Minecraft color names to hex
function getMinecraftColor(color) {
    const colors = {
        "BLACK": "#000000",
        "DARK_BLUE": "#0000AA",
        "DARK_GREEN": "#00AA00",
        "DARK_AQUA": "#00AAAA",
        "DARK_RED": "#AA0000",
        "DARK_PURPLE": "#AA00AA",
        "GOLD": "#FFD700",
        "GRAY": "#AAAAAA",
        "DARK_GRAY": "#555555",
        "BLUE": "#5555FF",
        "GREEN": "#55FF55",
        "AQUA": "#55FFFF",
        "RED": "#FF5555",
        "LIGHT_PURPLE": "#FF55FF",
        "YELLOW": "#FFFF55",
        "WHITE": "#FFFFFF"
    };
    return colors[color] || "#FFFFFF"; // Default to white
}