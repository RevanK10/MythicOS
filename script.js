let biggestIndex = 10;
let selectedIcon = null;
const topBar = document.querySelector("#top");

function updateTime() {
    const now = new Date();
    const currentTime = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + 
                        " " + 
                        now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const timeText = document.querySelector("#timeElement");
    if (timeText) timeText.innerHTML = currentTime;
}
updateTime();
setInterval(updateTime, 1000);

function initializeWindow(appName, customIconId = null) {
    const win = document.querySelector("#" + appName);
    const closeBtn = document.querySelector("#" + appName + "close");
    const openBtn = customIconId ? document.querySelector("#" + customIconId) : document.querySelector("#" + appName + "Open");

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
                if (appName === "filesApp") switchDirectory('weapons');
                if (appName === "emailApp") switchMailFolder('inbound');
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
    selectedIcon = element;
}

function deselectIcon(element) {
    if (element) element.classList.remove("selected");
    selectedIcon = null;
}

document.addEventListener("click", () => {
    if (selectedIcon) deselectIcon(selectedIcon);
});

function dragElement(element) {
    let initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    const header = document.getElementById(element.id + "header");
    
    if (header) { header.onmousedown = startDragging; }

    function startDragging(e) {
        if (element.classList.contains("fullscreen")) return;
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = moveElement;
    }

    function moveElement(e) {
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function setupFullscreenToggle(windowId, buttonId) {
    const maxBtn = document.querySelector("#" + buttonId);
    const win = document.querySelector("#" + windowId);
    if (maxBtn && win) {
        maxBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (win.classList.contains("fullscreen")) {
                win.classList.remove("fullscreen");
                win.style.top = "50%";
                win.style.left = "50%";
                win.style.transform = "translate(-50%, -50%)";
            } else {
                win.classList.add("fullscreen");
                win.style.top = "";
                win.style.left = "";
                win.style.transform = "";
            }
        });
    }
}

const appList = ["welcome", "notes", "searchApp", "settings", "filesApp", "calculatorApp", "emailApp", "musicApp", "printerApp"];
appList.forEach(app => {
    initializeWindow(app, app === "notes" ? "notesIcon" : null);
    if (app !== "welcome") setupFullscreenToggle(app, app + "maximize");
});

document.querySelectorAll(".dock-icon").forEach(icon => {
    const targetId = icon.id.replace("dock", "").replace("Open", "");
    const win = document.getElementById(targetId) || document.getElementById(targetId.charAt(0).toLowerCase() + targetId.slice(1));
    if (icon && win) {
        icon.addEventListener("click", () => {
            win.style.display = "flex";
            bringToFront(win);
            if (win.id === "filesApp") switchDirectory('weapons');
            if (win.id === "emailApp") switchMailFolder('inbound');
        });
    }
});

const wallpaperButtons = document.querySelectorAll(".wallpaper-btn");
wallpaperButtons.forEach(button => {
    button.addEventListener("click", () => {
        const newImageUrl = button.getAttribute("data-bg");
        document.body.style.backgroundImage = "url('" + newImageUrl + "')";
        localStorage.setItem("mythic_os_wallpaper", newImageUrl);
    });
});
const savedWallpaper = localStorage.getItem("mythic_os_wallpaper");
if (savedWallpaper) document.body.style.backgroundImage = "url('" + savedWallpaper + "')";

const searchInput = document.getElementById('searchInput');
const resContainer = document.getElementById('searchResults');

const initialLedgerHTML = `
    <p style="color: #ffcc00; font-weight: 600; margin-bottom: 8px;">Spells of Instant Manifestation:</p>
    <p style="opacity: 0.6; font-style: italic; margin-bottom: 12px;">Type these runes into the search channel to summon apps:</p>
    <ul style="padding-left: 18px; opacity: 0.8; line-height: 1.8; list-style-type: square;">
        <li><b>"matrices"</b> or <b>"math"</b> — Summon Alchemical Matrices Board</li>
        <li><b>"vault"</b> or <b>"files"</b> — Unseal Vault Arcanum Directories</li>
        <li><b>"choir"</b> or <b>"music"</b> — Begin the Bard's Choir Player</li>
        <li><b>"horizons"</b> or <b>"settings"</b> — Alter Landscape Planar Visuals</li>
        <li><b>"forge"</b> or <b>"print"</b> — Initialize Sigil Forge Inscriptions</li>
    </ul>
`;
if (resContainer) resContainer.innerHTML = initialLedgerHTML;

if (searchInput && resContainer) {
    searchInput.addEventListener('input', () => {
        const rawQuery = searchInput.value.trim().toLowerCase();
        if (!rawQuery) {
            resContainer.innerHTML = initialLedgerHTML;
            return;
        }

        if (rawQuery === "math" || rawQuery === "matrices") {
            openSystemApp("calculatorApp");
            resContainer.innerHTML = `<p style="color:#34c759;">Summoning calculation nodes successful.</p>`;
            return;
        }
        if (rawQuery === "vault" || rawQuery === "files") {
            openSystemApp("filesApp");
            switchDirectory('weapons');
            resContainer.innerHTML = `<p style="color:#34c759;">Unsealing live scroll database.</p>`;
            return;
        }
        if (rawQuery === "choir" || rawQuery === "music") {
            openSystemApp("musicApp");
            resContainer.innerHTML = `<p style="color:#34c759;">Tuning acoustic sound grids.</p>`;
            return;
        }
        if (rawQuery === "horizons" || rawQuery === "settings") {
            openSystemApp("settings");
            resContainer.innerHTML = `<p style="color:#34c759;">Accessing planar vision alignment matrix.</p>`;
            return;
        }
        if (rawQuery === "forge" || rawQuery === "print") {
            openSystemApp("printerApp");
            resContainer.innerHTML = `<p style="color:#34c759;">Initializing heat bed matrix elements.</p>`;
            return;
        }

        resContainer.innerHTML = `
            <p style="color:#ffcc00; margin-bottom: 10px;">Scrying dark archives for structural matches to "${searchInput.value}"...</p>
            <div style="font-size: 0.8rem; padding: 10px; background: rgba(255,0,0,0.1); border-radius:6px; color:#ff453a; border: 1px solid rgba(255,0,0,0.15)">
                No active spectral pathways found matching this runic search sequence.
            </div>
        `;
    });
}

function openSystemApp(appId) {
    const win = document.getElementById(appId);
    if(win) { win.style.display = "flex"; bringToFront(win); }
}

const vaultData = {
    weapons: [
        { id: "w1", name: "Phoenix Blade.arm", text: "Forged inside deep volcanic vents. Radiant fire attribution arrays active." },
        { id: "w2", name: "Shattered Aegis.arm", text: "A cracked defensive shield structure capable of absorbing residual aura damage." },
        { id: "w3", name: "Void Scepter.arm", text: "Manipulates microscopic subspace wormholes. Warning: Drains local user mana." }
    ],
    tomes: [
        { id: "t1", name: "Chronos Codex.txt", text: "A detailed dynamic manual charting historical branches. Time distortion present." },
        { id: "t2", name: "Ethereal Alchemy.txt", text: "Formulas concerning the restructuring of base heavy leads into raw pristine gold element." }
    ],
    scrolls: [
        { id: "s1", name: "Imperial Pact.dec", text: "Peace decree aligning border networks to shared shield matrix protocols." },
        { id: "s2", name: "Banishing Decree.dec", text: "Permanently sends malicious spiritual entities beyond kingdom coordinates." }
    ]
};

let activeDirectory = 'weapons';
let activeFileId = null;

function switchDirectory(dirKey) {
    activeDirectory = dirKey;
    const tabs = document.querySelectorAll("#vaultDirectories li");
    tabs.forEach(t => t.classList.remove("active"));
    event.currentTarget.classList.add("active");

    const container = document.getElementById("vaultGrid");
    container.innerHTML = "";
    container.className = "vault-grid-layout";

    vaultData[dirKey].forEach(file => {
        const div = document.createElement("div");
        div.className = "file-item";
        if (activeFileId === file.id) div.style.background = "rgba(255,255,255,0.15)";
        
        let icon = "📄";
        if(dirKey === 'weapons') icon = "⚔️";
        if(dirKey === 'tomes') icon = "📖";
        if(dirKey === 'scrolls') icon = "📜";

        div.innerHTML = `
            <div style="font-size: 1.8rem;">${icon}</div>
            <p style="font-size: 0.7rem; margin-top: 6px; font-weight: 600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${file.name}</p>
        `;
        div.onclick = () => loadFileIntoEditor(file);
        container.appendChild(div);
    });
}

function loadFileIntoEditor(file) {
    activeFileId = file.id;

    switchDirectory(activeDirectory);

    document.getElementById("editorFileName").innerText = file.name;
    const textarea = document.getElementById("editorFileContent");
    const saveBtn = document.getElementById("editorSaveBtn");
    
    textarea.value = file.text;
    textarea.removeAttribute("disabled");
    saveBtn.removeAttribute("disabled");
}

function saveCurrentFile() {
    if (!activeFileId) return;
    const updatedText = document.getElementById("editorFileContent").value;
    
    const fileObj = vaultData[activeDirectory].find(f => f.id === activeFileId);
    if (fileObj) {
        fileObj.text = updatedText;
        alert(`Manifest saved successfully: "${fileObj.name}" configurations overwritten.`);
    }
}

window.pressCalc = function(val) { document.getElementById('calcDisplay').value += val; }
window.clearCalc = function() { document.getElementById('calcDisplay').value = ''; }
window.calculateResult = function() {
    const display = document.getElementById('calcDisplay');
    try { display.value = Function('"use strict";return (' + display.value + ')')(); } 
    catch { display.value = 'Syntax Error'; }
}

const mailBox = {
    inbound: [
        { sender: "Archmage Eldrin", time: "3 Mins Ago", subject: "Anomalies in outer barrier grid", content: "The crystalline protection shields are experiencing energy fluctuations. Ready your frameworks." },
        { sender: "Spymaster Vane", time: "2 Hours Ago", subject: "Movement in northern canyon paths", content: "Shadow fractions have sent scout forces across kingdom coordinates. Track carefully." }
    ],
    outbound: []
};

function switchMailFolder(folder) {
    document.getElementById("folder-inbound").classList.remove("active");
    document.getElementById("folder-outbound").classList.remove("active");
    document.getElementById(`folder-${folder}`).classList.add("active");

    const container = document.getElementById("mailList");
    const viewer = document.getElementById("mailViewer");
    container.style.display = "flex";
    viewer.style.display = "none";
    container.innerHTML = "";

    mailBox[folder].forEach(mail => {
        const row = document.createElement("div");
        row.className = "mail-item-row";
        row.innerHTML = `
            <div class="mail-meta"><b>${mail.sender}</b> <span>${mail.time}</span></div>
            <p class="mail-subject">${mail.subject}</p>
        `;
        row.onclick = () => {
            container.style.display = "none";
            viewer.style.display = "flex";
            viewer.innerHTML = `
                <button onclick="closeMailViewer()" style="align-self:flex-start; padding:4px 8px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; cursor:pointer; margin-bottom:12px; border-radius:4px;">⬅ Back</button>
                <h3>${mail.subject}</h3>
                <p style="font-size:0.75rem; opacity:0.5; margin-bottom:12px;">From: ${mail.sender}</p>
                <div style="font-size:0.85rem; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">${mail.content}</div>
            `;
        };
        container.appendChild(row);
    });
}
function closeMailViewer() {
    document.getElementById("mailList").style.display = "flex";
    document.getElementById("mailViewer").style.display = "none";
}
function composeMissive() {
    const target = prompt("Target Nexus Registry Address String:");
    const body = prompt("Carve message payload context:");
    if (target && body) {
        mailBox.outbound.unshift({ sender: "To: " + target, time: "Just Now", subject: "Secure Sigil Sealed Missive", content: body });
        switchMailFolder('outbound');
    }
}

const mythicTracks = [
    { title: "Echoes of the High Keep", artist: "Minstrel of the Peak", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Chant of the Iron Foundry", artist: "Dwarven Anvil Choir", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
];
let currentTrackIndex = 0;
const audioNode = document.getElementById("audioNode");
const playPauseBtn = document.getElementById("playPauseBtn");

function renderPlaylist() {
    const pl = document.getElementById("playlistItems");
    pl.innerHTML = "";
    mythicTracks.forEach((track, idx) => {
        const li = document.createElement("li");
        li.style.padding = "6px 8px";
        li.style.cursor = "pointer";
        if (idx === currentTrackIndex) { li.style.color = "#ffcc00"; li.style.background = "rgba(255,255,255,0.08)"; }
        li.innerHTML = `<b>${track.title}</b> - ${track.artist}`;
        li.onclick = () => { loadTrack(idx); audioNode.play(); playPauseBtn.innerText = "⏸"; };
        pl.appendChild(li);
    });
}
function loadTrack(idx) {
    currentTrackIndex = idx;
    audioNode.src = mythicTracks[idx].src;
    document.getElementById("currentTrackTitle").innerText = mythicTracks[idx].title;
    document.getElementById("currentTrackArtist").innerText = mythicTracks[idx].artist;
    renderPlaylist();
}
function togglePlayback() {
    if(!audioNode.src) loadTrack(0);
    if (audioNode.paused) { audioNode.play(); playPauseBtn.innerText = "⏸"; } 
    else { audioNode.pause(); playPauseBtn.innerText = "▶"; }
}
function nextTrack() { loadTrack((currentTrackIndex + 1) % mythicTracks.length); audioNode.play(); playPauseBtn.innerText = "⏸"; }
function prevTrack() { loadTrack((currentTrackIndex - 1 + mythicTracks.length) % mythicTracks.length); audioNode.play(); playPauseBtn.innerText = "⏸"; }
if(audioNode) {
    audioNode.addEventListener('timeupdate', () => {
        if(!isNaN(audioNode.duration)) {
            document.getElementById("trackProgress").value = (audioNode.currentTime / audioNode.duration) * 100;
            document.getElementById("trackCurrentTime").innerText = Math.floor(audioNode.currentTime / 60) + ":" + Math.floor(audioNode.currentTime % 60).toString().padStart(2, '0');
            document.getElementById("trackDuration").innerText = Math.floor(audioNode.duration / 60) + ":" + Math.floor(audioNode.duration % 60).toString().padStart(2, '0');
        }
    });
}
loadTrack(0);

function forgeSigil() {
    const txt = document.getElementById("printerInput").value.trim();
    const log = document.getElementById("forgeStatusLog");
    if (!txt) { log.style.color = "#ff453a"; log.innerText = "Input text buffer empty!"; return; }

    log.style.color = "#ffcc00"; log.innerText = "Warming heat arrays...";
    setTimeout(() => {
        log.style.color = "#34c759"; log.innerText = "Document successfully forged! Opening stream viewport...";
        const pWin = window.open('', '_blank');
        pWin.document.write(`<html><body style="font-family:serif; padding:40px; background:#faf8f5;"><div style="border:4px double #444; padding:30px; max-width:600px; margin:0 auto;"><h1>Sigil Forge Manifest</h1><p>Forged via MythicOS Framework: ${new Date().toLocaleString()}</p><hr style="margin:20px 0;"><p style="white-space:pre-wrap;">${txt}</p></div><script>window.onload=function(){window.print();}</script></body></html>`);
        pWin.document.close();
    }, 1200);
}