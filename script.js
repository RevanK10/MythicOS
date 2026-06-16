var biggestIndex = 10;
var selectedIcon = null;
var topBar = document.querySelector("#top");

function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    if (timeText) timeText.innerHTML = currentTime;
}
updateTime();
setInterval(updateTime, 1000);

function initializeWindow(appName, customIconId = null) {
    var win = document.querySelector("#" + appName);
    var header = document.querySelector("#" + appName + "header");
    var closeBtn = document.querySelector("#" + appName + "close");
    
    var openBtn = customIconId ? document.querySelector("#" + customIconId) : document.querySelector("#" + appName + "Open");

    if (win) {
        dragElement(win);
        win.addEventListener("mousedown", () => {
            bringToFront(win);
            if (selectedIcon) deselectIcon(selectedIcon);
        });
    }

    if (closeBtn && win) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            win.style.display = "none";
        });
    }

    if (openBtn && win) {
        openBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            
            if (openBtn.classList.contains("desktop-icon")) {
                if (openBtn.classList.contains("selected")) {
                    deselectIcon(openBtn);
                    win.style.display = "flex";
                    bringToFront(win);
                } else {
                    if (selectedIcon) deselectIcon(selectedIcon);
                    selectIcon(openBtn);
                }
            } else {
                win.style.display = "flex";
                bringToFront(win);
            }
        });
    }
}

function bringToFront(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    if (topBar) topBar.style.zIndex = biggestIndex + 1;
}

function selectIcon(element) {
    element.classList.add("selected");
    element.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
    selectedIcon = element;
}

function deselectIcon(element) {
    if (element) {
        element.classList.remove("selected");
        element.style.backgroundColor = "transparent";
    }
    selectedIcon = null;
}

document.addEventListener("click", () => {
    if (selectedIcon) deselectIcon(selectedIcon);
});

function dragElement(element) {
    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    var header = document.getElementById(element.id + "header");
    
    if (header) { header.onmousedown = startDragging; } 
    else { element.onmousedown = startDragging; }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = moveElement;
    }

    function moveElement(e) {
        e = e || window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
        element.style.transform = "none"; // Stop translation jumping loops
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var vaultData = [
    {
        title: "Phoenix Blade",
        type: "Artifact Class IV",
        content: `
            <h2 style="margin-bottom: 10px;">The Phoenix Blade</h2>
            <p style="color: #666; font-style: italic; margin-bottom: 15px;">Forged in the heart of the Mt. Obsidian fissure.</p>
            <p>This localized asset features active flame modification capabilities. Deals +45 heat structural degradation vectors against frost-based parameters.</p>
            <div style="background: #FFF3CD; padding: 12px; border-left: 4px solid #FFC107; margin: 15px 0; border-radius: 4px;">
                <strong>System Record:</strong> Currently locked inside vault inventory stasis matrix block #094.
            </div>
        `
    },
    {
        title: "Chronos Mirror",
        type: "Temporal Anchor",
        content: `
            <h2 style="margin-bottom: 10px;">The Chronos Mirror</h2>
            <p style="color: #666; font-style: italic; margin-bottom: 15px;">Discovered within the shifting sands of the Lost Oasis.</p>
            <p>Allows the runtime window operator to visually review log historical tracks up to 10 seconds backwards into active operational stream pipelines.</p>
        `
    }
];

function setVaultContent(index) {
    var view = document.querySelector("#contentDisplay");
    if (view) view.innerHTML = vaultData[index].content;
}

function buildVaultMenu() {
    var sidebar = document.querySelector("#sidebar");
    if (!sidebar) return;
    sidebar.innerHTML = "";

    vaultData.forEach((item, index) => {
        var card = document.createElement("div");
        card.className = "menu-card";
        card.innerHTML = `
            <h4 style="margin: 0; font-size: 13px; color: #111;">${item.title}</h4>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #777;">${item.type}</p>
        `;
        card.addEventListener("click", () => setVaultContent(index));
        sidebar.appendChild(card);
    });

    if (vaultData.length > 0) setVaultContent(0);
}

initializeWindow("welcome");
initializeWindow("vault", "vaultIcon");
buildVaultMenu();