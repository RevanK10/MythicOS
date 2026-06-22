var biggestIndex = 10;
var selectedIcon = null;
var topBar = document.querySelector("#top");

// --- 1. SYSTEM CLOCK COMPONENT ---
function updateTime() {
    var currentTime = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + " " + new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    var timeText = document.querySelector("#timeElement");
    if (timeText) timeText.innerHTML = currentTime;
}
updateTime();
setInterval(updateTime, 1000);

// --- 2. UNIVERSAL WINDOW INITIALIZATION ENGINE ---
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
            if (appName === "cameraApp") stopWebcam();
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

// --- 3. DISPLAY DEPTH LAYER MANAGEMENT ---
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
    if (element) {
        element.classList.remove("selected");
    }
    selectedIcon = null;
}

document.addEventListener("click", () => {
    if (selectedIcon) deselectIcon(selectedIcon);
});

// --- 4. WINDOW DRAG CONTROLS ---
function dragElement(element) {
    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    var header = document.getElementById(element.id + "header");
    
    if (header) { header.onmousedown = startDragging; } 
    else { element.onmousedown = startDragging; }

    function startDragging(e) {
        if (element.classList.contains("fullscreen")) return;
        e = e || window.event;
        if (e.target.classList.contains("closebutton") || e.target.classList.contains("minimizebutton") || e.target.classList.contains("maximizebutton")) return;
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
        element.style.transform = "none"; 
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- 5. NOTES LIVE DATA PERSISTENCE ENGINE ---
var notepad = document.querySelector("#notepad");
if (notepad && localStorage.getItem("vedic_notes_data")) {
    notepad.value = localStorage.getItem("vedic_notes_data");
}
if (notepad) {
    notepad.addEventListener("input", () => {
        localStorage.setItem("vedic_notes_data", notepad.value);
    });
}

// --- 6. CORE OPERATING SYSTEM INSTANTIATIONS ---
initializeWindow("welcome");
initializeWindow("notes", "notesIcon"); 
initializeWindow("searchApp");
initializeWindow("settings");
initializeWindow("filesApp");
initializeWindow("cameraApp");
initializeWindow("clockApp");
initializeWindow("calculatorApp");
initializeWindow("emailApp");

// --- 7. FULLSCREEN TOGGLE ACTIONS ---
function setupFullscreenToggle(windowId, buttonId) {
    var maxBtn = document.querySelector("#" + buttonId);
    var win = document.querySelector("#" + windowId);
    if (maxBtn && win) {
        maxBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (win.classList.contains("fullscreen")) {
                win.style.top = "50%";
                win.style.left = "50%";
                win.style.transform = "translate(-50%, -50%)";
            } else {
                win.style.top = "";
                win.style.left = "";
                win.style.transform = "";
            }
            win.classList.toggle("fullscreen");
        });
    }
}
setupFullscreenToggle("notes", "notesmaximize");
setupFullscreenToggle("searchApp", "searchAppmaximize");
setupFullscreenToggle("settings", "settingsmaximize");
setupFullscreenToggle("filesApp", "filesAppmaximize");
setupFullscreenToggle("cameraApp", "cameraAppmaximize");
setupFullscreenToggle("clockApp", "clockAppmaximize");
setupFullscreenToggle("calculatorApp", "calculatorAppmaximize");
setupFullscreenToggle("emailApp", "emailAppmaximize");

// --- 8. TRAY DOCK ANCHOR MANAGEMENT EVENT LISTENERS ---
var dockWelcomeBtn = document.querySelector("#dockWelcomeOpen");
var dockNotesBtn = document.querySelector("#dockNotesOpen");
var welcomeWindow = document.querySelector("#welcome");
var notesWindow = document.querySelector("#notes");

if (dockWelcomeBtn && welcomeWindow) {
    dockWelcomeBtn.addEventListener("click", () => {
        welcomeWindow.style.display = "flex";
        bringToFront(welcomeWindow);
    });
}
if (dockNotesBtn && notesWindow) {
    dockNotesBtn.addEventListener("click", () => {
        notesWindow.style.display = "flex";
        bringToFront(notesWindow);
    });
}

// --- 9. WALLPAPER SWITCHING PREFERENCE DATA CONTROLS ---
var wallpaperButtons = document.querySelectorAll(".wallpaper-btn");
wallpaperButtons.forEach(button => {
    button.addEventListener("click", () => {
        var newImageUrl = button.getAttribute("data-bg");
        document.body.style.backgroundImage = "url('" + newImageUrl + "')";
        localStorage.setItem("vedic_os_wallpaper", newImageUrl);
    });
});
var savedWallpaper = localStorage.getItem("vedic_os_wallpaper");
if (savedWallpaper) {
    document.body.style.backgroundImage = "url('" + savedWallpaper + "')";
}

// --- 10. REAL-TIME VEDIC ORACLE SEARCH ENGINE ---
var searchInput = document.getElementById('searchInput');
var resContainer = document.getElementById('searchResults');

var initialLedgerHTML = `
    <p style="color: #ffcc00; font-weight: 600; margin-bottom: 8px;">🔮 Divya Keyphrase Ledger:</p>
    <p style="opacity: 0.6; font-style: italic; margin-bottom: 12px;">Your inputs filter data planes dynamically across coordinates:</p>
    <ul style="padding-left: 18px; opacity: 0.8; line-height: 1.8; list-style-type: square;">
        <li><b>"ganita"</b> or <b>"calculator"</b> — Reveal Vedic Matrix</li>
        <li><b>"drishti"</b> or <b>"camera"</b> — Unshroud Sanjay Tele-Vision lens</li>
        <li><b>"kaala"</b> or <b>"clock"</b> — Stream Cosmic Chronometer Dial</li>
        <li><b>"astra"</b> or <b>"files"</b> — Unseal Artifact Reliquary vaults</li>
        <li><b>"dharma"</b> or <b>"settings"</b> — Reshape Loka Wallpapers</li>
    </ul>
`;

// Display initial state
if (resContainer) resContainer.innerHTML = initialLedgerHTML;

if (searchInput && resContainer) {
    searchInput.addEventListener('input', () => {
        var rawQuery = searchInput.value.trim().toLowerCase();

        if (!rawQuery) {
            resContainer.innerHTML = initialLedgerHTML;
            return;
        }

        // Live matches logic
        if (rawQuery === "calculator" || rawQuery === "ganita") {
            openSystemApp("calculatorApp");
            resContainer.innerHTML = `<p style="color:#34c759;">⚡ Manifested the Vedic Ganita structural matrix array.</p>`;
            return;
        }
        if (rawQuery === "camera" || rawQuery === "drishti") {
            openSystemApp("cameraApp");
            startWebcam();
            resContainer.innerHTML = `<p style="color:#34c759;">⚡ Piercing dimension barriers via Sanjaya Drishti Reflex Streams.</p>`;
            return;
        }
        if (rawQuery === "clock" || rawQuery === "kaala") {
            openSystemApp("clockApp");
            runBigClock();
            resContainer.innerHTML = `<p style="color:#34c759;">⚡ Linked to absolute Mahakaala Celestial Alignment matrix.</p>`;
            return;
        }
        if (rawQuery === "files" || rawQuery === "astra") {
            openSystemApp("filesApp");
            resContainer.innerHTML = `<p style="color:#34c759;">⚡ Unsealed divine Astra artifacts armor node registers.</p>`;
            return;
        }
        if (rawQuery === "settings" || rawQuery === "dharma") {
            openSystemApp("settings");
            resContainer.innerHTML = `<p style="color:#34c759;">⚡ Modifying foundational plane parameters via Dharma configuration layers.</p>`;
            return;
        }

        // Realtime External Anchor Search fallback
        resContainer.innerHTML = `
            <p style="color:#ffcc00; margin-bottom: 10px;">Consulting wider data streams for "${searchInput.value}"...</p>
            <div style="margin-bottom: 8px;"><a href="https://www.google.com/search?q=${encodeURIComponent(searchInput.value)}" target="_blank" style="color:#ffcc00; font-weight:600; text-decoration:none;">🌐 Astral Projection Search: Google</a></div>
            <div><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(searchInput.value)}" target="_blank" style="color:#ffcc00; font-weight:600; text-decoration:none;">📜 Great Alexandrian Archive (Wikipedia)</a></div>
        `;
    });
}

function openSystemApp(appId) {
    var targetWin = document.getElementById(appId);
    if(targetWin) {
        targetWin.style.display = "flex";
        bringToFront(targetWin);
    }
}

// --- 11. EXTRA EXPANSION HARDWARE CONTROLS ---
var webcamStream = null;
function startWebcam() {
    var video = document.getElementById('cameraVideo');
    var fallback = document.getElementById('cameraFallback');
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            webcamStream = stream;
            if(video) video.srcObject = stream;
            if(fallback) fallback.style.display = 'none';
        })
        .catch(() => { if(fallback) fallback.innerHTML = "Sanjaya lens obscured by heavy atmospheric matter."; });
}
function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
    }
}

function runBigClock() {
    var bClock = document.getElementById('bigClockDisplay');
    var bDate = document.getElementById('bigDateDisplay');
    var clockTimer = setInterval(() => {
        var now = new Date();
        var win = document.getElementById('clockApp');
        if(win && win.style.display === 'none') { clearInterval(clockTimer); return; }
        if(bClock) bClock.innerText = now.toTimeString().split(' ')[0];
        if(bDate) bDate.innerText = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, 1000);
}

var calcDisplay = document.getElementById('calcDisplay');
function pressCalc(val) { if(calcDisplay) calcDisplay.value += val; }
function clearCalc() { if(calcDisplay) calcDisplay.value = ''; }
function calculateResult() {
    if(!calcDisplay) return;
    try {
        var outcome = Function('"use strict";return (' + calcDisplay.value + ')')();
        calcDisplay.value = outcome !== undefined ? outcome : '';
    } catch(err) { calcDisplay.value = 'Error'; }
}