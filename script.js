var biggestIndex = 10;
var selectedIcon = null;
var topBar = document.querySelector("#top");

// --- 1. SYSTEM CLOCK COMPONENT ---
function updateTime() {
    var currentTime = new Date().toLocaleString();
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

// --- 4. WINDOW DRAG CONTROLS ---
function dragElement(element) {
    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    var header = document.getElementById(element.id + "header");
    
    if (header) { header.onmousedown = startDragging; } 
    else { element.onmousedown = startDragging; }

    function startDragging(e) {
        // 🌟 FIX: If the window is currently full-screen, do not allow moving it!
        if (element.classList.contains("fullscreen")) return;

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
        element.style.transform = "none"; 
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- 5. NOTES LIVE DATA PERSISTENCE ENGINE ---
var notepad = document.querySelector("#notepad");

// Check memory blocks and instantly reload past records if they exist
if (notepad && localStorage.getItem("mythic_notes_data")) {
    notepad.value = localStorage.getItem("mythic_notes_data");
}

// Real-time listener saving layout keystrokes instantly to browser memory
if (notepad) {
    notepad.addEventListener("input", () => {
        localStorage.setItem("mythic_notes_data", notepad.value);
    });
}

// --- 6. CORE OPERATING SYSTEM INSTANTIATIONS ---
initializeWindow("welcome");
initializeWindow("notes", "notesIcon"); // Activating your new notes engine

// --- 7. FULLSCREEN TOGGLE SYSTEM ---
var notesMaxBtn = document.querySelector("#notesmaximize");
var notesWindow = document.querySelector("#notes");

if (notesMaxBtn && notesWindow) {
    notesMaxBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents dragging handlers from jumping in
        
        // If we are exiting fullscreen, re-center the window neatly
        if (notesWindow.classList.contains("fullscreen")) {
            notesWindow.style.top = "50%";
            notesWindow.style.left = "50%";
            notesWindow.style.transform = "translate(-50%, -50%)";
        } else {
            // Clear manual drag values so CSS classes can take complete control
            notesWindow.style.top = "";
            notesWindow.style.left = "";
            notesWindow.style.transform = "";
        }
        
        notesWindow.classList.toggle("fullscreen");
    });
}