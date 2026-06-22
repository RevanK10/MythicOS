/**
 * ==========================================================================
 * SYSTEMS AND HANDLERS
 * ==========================================================================
 * Standard interactive layer handles depth manipulation, layout switches, 
 * window dragging, and simplified mythological application actions.
 */

let biggestIndex = 10;
let selectedIcon = null;
const topBar = document.querySelector("#top");
let globalClockInterval = null;

// --- 1. SYSTEM TIME MONITOR ---
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

// --- 2. WINDOW CREATION AND INTERACTION HOOKS ---
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

// --- 3. LAYER AND INDEX DEPTH CONTROLS ---
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

// --- 4. WINDOW MOVEMENT LOGIC ---
function dragElement(element) {
    let initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    const header = document.getElementById(element.id + "header");
    
    if (header) { 
        header.onmousedown = startDragging; 
    } else { 
        element.onmousedown = startDragging; 
    }

    function startDragging(e) {
        if (element.classList.contains("fullscreen")) return;
        e = e || window.event;
        
        // Block movement triggers if user hits control points
        if (e.target.classList.contains("closebutton") || 
            e.target.classList.contains("minimizebutton") || 
            e.target.classList.contains("maximizebutton")) return;
            
        e.preventDefault();
        
        if (element.style.transform && element.style.transform !== "none") {
            const rect = element.getBoundingClientRect();
            element.style.transform = "none";
            element.style.top = rect.top + "px";
            element.style.left = rect.left + "px";
        }

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
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- 5. SAVED INSIGHTS STORAGE ---
const notepad = document.querySelector("#notepad");
if (notepad && localStorage.getItem("mythic_notes_data")) {
    notepad.value = localStorage.getItem("mythic_notes_data");
}
if (notepad) {
    notepad.addEventListener("input", () => {
        localStorage.setItem("mythic_notes_data", notepad.value);
    });
}

// --- 6. ATTACH HANDLERS TO WORKSPACE APPLICATIONS ---
const appList = ["welcome", "notes", "searchApp", "settings", "filesApp", "cameraApp", "clockApp", "calculatorApp", "emailApp"];
appList.forEach(app => {
    if (app === "notes") {
        initializeWindow(app, "notesIcon");
    } else {
        initializeWindow(app);
    }
});

// --- 7. RE-SIZING PARAMETERS ---
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
setupFullscreenToggle("notes", "notesmaximize");
setupFullscreenToggle("searchApp", "searchAppmaximize");
setupFullscreenToggle("settings", "settingsmaximize");
setupFullscreenToggle("filesApp", "filesAppmaximize");
setupFullscreenToggle("cameraApp", "cameraAppmaximize");
setupFullscreenToggle("clockApp", "clockAppmaximize");
setupFullscreenToggle("calculatorApp", "calculatorAppmaximize");
setupFullscreenToggle("emailApp", "emailAppmaximize");

// --- 8. LOWER DOCK SELECTIONS ---
const dockWelcomeBtn = document.querySelector("#dockWelcomeOpen");
const dockNotesBtn = document.querySelector("#dockNotesOpen");
const welcomeWindow = document.querySelector("#welcome");
const notesWindow = document.querySelector("#notes");

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

// --- 9. LOCAL AMBIENCE PREFERENCE CONTROLS ---
const wallpaperButtons = document.querySelectorAll(".wallpaper-btn");
wallpaperButtons.forEach(button => {
    button.addEventListener("click", () => {
        const newImageUrl = button.getAttribute("data-bg");
        document.body.style.backgroundImage = "url('" + newImageUrl + "')";
        localStorage.setItem("mythic_os_wallpaper", newImageUrl);
    });
});
const savedWallpaper = localStorage.getItem("mythic_os_wallpaper");
if (savedWallpaper) {
    document.body.style.backgroundImage = "url('" + savedWallpaper + "')";
}

// --- 10. DIVINE SIGHT DIRECTORY LOOKUP ---
const searchInput = document.getElementById('searchInput');
const resContainer = document.getElementById('searchResults');

const initialLedgerHTML = `
    <p style="color: #ffcc00; font-weight: 600; margin-bottom: 8px;">Search Phrases:</p>
    <p style="opacity: 0.6; font-style: italic; margin-bottom: 12px;">Type a word to find an app:</p>
    <ul style="padding-left: 18px; opacity: 0.8; line-height: 1.8; list-style-type: square;">
        <li><b>"calculator"</b> or <b>"math"</b> — Compute values</li>
        <li><b>"sight"</b> or <b>"vision"</b> — Invoke the Sanjaya Mirror</li>
        <li><b>"chrono"</b> or <b>"time"</b> — Check cosmic positioning hours</li>
        <li><b>"armory"</b> or <b>"files"</b> — Access the Sacred Weapons safe</li>
        <li><b>"wallpaper"</b> or <b>"laws"</b> — Change current sky visuals</li>
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

        if (rawQuery === "math" || rawQuery === "calc" || rawQuery === "calculator") {
            openSystemApp("calculatorApp");
            resContainer.innerHTML = `<p style="color:#34c759;">Displaying the calculations board.</p>`;
            return;
        }
        if (rawQuery === "sight" || rawQuery === "vision") {
            openSystemApp("cameraApp");
            startWebcam();
            resContainer.innerHTML = `<p style="color:#34c759;">Activating the divine mirror.</p>`;
            return;
        }
        if (rawQuery === "time" || rawQuery === "chrono") {
            openSystemApp("clockApp");
            runBigClock();
            resContainer.innerHTML = `<p style="color:#34c759;">Aligning time monitoring metrics.</p>`;
            return;
        }
        if (rawQuery === "armory" || rawQuery === "files") {
            openSystemApp("filesApp");
            resContainer.innerHTML = `<p style="color:#34c759;">Accessing the sacred weapon inventory shelves.</p>`;
            return;
        }
        if (rawQuery === "laws" || rawQuery === "dharma") {
            openSystemApp("settings");
            resContainer.innerHTML = `<p style="color:#34c759;">Loading sky environmental laws.</p>`;
            return;
        }

        resContainer.innerHTML = `
            <p style="color:#ffcc00; margin-bottom: 10px;">Searching standard indices for "${searchInput.value}"...</p>
            <div style="margin-bottom: 8px;"><a href="https://www.google.com/search?q=${encodeURIComponent(searchInput.value)}" target="_blank" style="color:#ffcc00; font-weight:600; text-decoration:none;">🌐 External Search: Google</a></div>
            <div><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(searchInput.value)}" target="_blank" style="color:#ffcc00; font-weight:600; text-decoration:none;">📜 Historic Encyclopedias (Wikipedia)</a></div>
        `;
    });
}

function openSystemApp(appId) {
    const targetWin = document.getElementById(appId);
    if(targetWin) {
        targetWin.style.display = "flex";
        bringToFront(targetWin);
    }
}

// --- 11. MEDIA AND CALCULATOR FUNCTIONS ---
let webcamStream = null;
function startWebcam() {
    const video = document.getElementById('cameraVideo');
    const fallback = document.getElementById('cameraFallback');
    
    if (webcamStream) stopWebcam();

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            webcamStream = stream;
            if(video) video.srcObject = stream;
            if(fallback) fallback.style.display = 'none';
        })
        .catch(() => { 
            if(fallback) fallback.innerHTML = "Camera permission blocked or hardware missing."; 
        });
}

function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
    }
}

function runBigClock() {
    const bClock = document.getElementById('bigClockDisplay');
    const bDate = document.getElementById('bigDateDisplay');
    
    if (globalClockInterval) clearInterval(globalClockInterval);

    globalClockInterval = setInterval(() => {
        const win = document.getElementById('clockApp');
        if(win && win.style.display === 'none') { 
            clearInterval(globalClockInterval); 
            return; 
        }
        const now = new Date();
        if(bClock) bClock.innerText = now.toTimeString().split(' ')[0];
        if(bDate) bDate.innerText = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, 1000);
}

window.pressCalc = function(val) {
    const calcDisplay = document.getElementById('calcDisplay');
    if(calcDisplay) calcDisplay.value += val;
}

window.clearCalc = function() {
    const calcDisplay = document.getElementById('calcDisplay');
    if(calcDisplay) calcDisplay.value = '';
}

window.calculateResult = function() {
    const calcDisplay = document.getElementById('calcDisplay');
    if(!calcDisplay) return;
    try {
        const outcome = Function('"use strict";return (' + calcDisplay.value + ')')();
        calcDisplay.value = outcome !== undefined ? outcome : '';
    } catch(err) { 
        calcDisplay.value = 'Error'; 
    }
}