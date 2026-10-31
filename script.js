const startButton = document.getElementById("start-button");
const welcomeScreen = document.querySelector(".welcome-screen");
const desktop = document.querySelector(".desktop");

let activeWindow = null;
let highestZIndex = 100;

if (startButton && welcomeScreen && desktop) {
    startButton.addEventListener("click", () => {
        welcomeScreen.style.display = "none";
        desktop.style.display = "block";
    });
}

function updateDate() {
    const dateElement = document.getElementById("date");

    if (!dateElement) {
        return;
    }

    const now = new Date();

    dateElement.textContent = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

function updateTime() {
    const timeElement = document.getElementById("clock");
    if (!timeElement) return;

    const now = new Date();

    timeElement.textContent = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}

updateDate();
updateTime();

setInterval(updateTime, 1000);
setInterval(updateDate, 60000);

const logoutButton = document.getElementById("logout-button");

if (logoutButton && welcomeScreen && desktop) {
    logoutButton.addEventListener("click", () => {
        desktop.style.display = "none";
        welcomeScreen.style.display = "flex";
    });
}

async function updateBattery() {
    const batteryElement = document.getElementById("battery");

    if (!batteryElement) {
        return;
    }

    if (!navigator.getBattery) {
        batteryElement.textContent = "🔋 --%";
        return;
    }

    try {
        const battery = await navigator.getBattery();

        function updateBatteryDisplay() {
            const percentage = Math.round(battery.level * 100);
            batteryElement.textContent = `🔋 ${percentage}%`;
        }

        updateBatteryDisplay();

        battery.addEventListener("levelchange", updateBatteryDisplay);
    } catch {
        batteryElement.textContent = "🔋 --%";
    }
}

updateBattery();

function updateNetwork() {
    const networkElement = document.getElementById("network");

    if (!networkElement) {
        return;
    }

    networkElement.textContent = navigator.onLine ? "📶" : "❌";
}

updateNetwork();

window.addEventListener("online", updateNetwork);
window.addEventListener("offline", updateNetwork);

const volumeButton = document.getElementById("volume");
const volumePopup = document.getElementById("volume-popup");
const volumeSlider = document.getElementById("volume-slider");
const volumeValue = document.getElementById("volume-value");

function updateVolumeIcon(value) {
    if (!volumeButton) {
        return;
    }

    const volume = Number(value);

    if (volume === 0) {
        volumeButton.textContent = "🔇";
    } else if (volume < 40) {
        volumeButton.textContent = "🔈";
    } else if (volume < 70) {
        volumeButton.textContent = "🔉";
    } else {
        volumeButton.textContent = "🔊";
    }
}

if (volumeButton && volumePopup) {
    volumeButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = volumePopup.style.display === "flex";
        volumePopup.style.display = isOpen ? "none" : "flex";
    });
}

if (volumeSlider && volumeValue) {
    volumeValue.textContent = `${volumeSlider.value}%`;
    updateVolumeIcon(volumeSlider.value);

    volumeSlider.addEventListener("input", () => {
        const value = volumeSlider.value;

        volumeValue.textContent = `${value}%`;
        updateVolumeIcon(value);
    });
}

document.addEventListener("click", (event) => {
    if (
        volumePopup &&
        volumeButton &&
        !volumePopup.contains(event.target) &&
        !volumeButton.contains(event.target)
    ) {
        volumePopup.style.display = "none";
    }
});

function bringToFront(windowElement) {
    if (!windowElement) {
        return;
    }

    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;
    activeWindow = windowElement;
}

function openWindow(windowElement) {
    if (!windowElement) {
        return;
    }

    windowElement.style.display = "flex";
    bringToFront(windowElement);
}

function closeWindow(windowElement) {
    if (!windowElement) {
        return;
    }

    windowElement.style.display = "none";
}

function minimizeWindow(windowElement) {
    if (!windowElement) {
        return;
    }

    windowElement.style.display = "none";
}

function makeDraggable(windowElement, headerElement) {
    if (!windowElement || !headerElement) {
        return;
    }

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    headerElement.style.cursor = "grab";

    headerElement.addEventListener("mousedown", (event) => {
        if (event.target.closest(".window-controls")) {
            return;
        }

        if (windowElement.classList.contains("maximized")) {
            return;
        }

        dragging = true;

        bringToFront(windowElement);

        const rect = windowElement.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        headerElement.style.cursor = "grabbing";

        event.preventDefault();
    });

    document.addEventListener("mousemove", (event) => {
        if (!dragging) {
            return;
        }

        const maxX = window.innerWidth - windowElement.offsetWidth;
        const maxY = window.innerHeight - windowElement.offsetHeight;

        const x = Math.max(
            0,
            Math.min(event.clientX - offsetX, maxX)
        );

        const y = Math.max(
            0,
            Math.min(event.clientY - offsetY, maxY)
        );

        windowElement.style.left = `${x}px`;
        windowElement.style.top = `${y}px`;
        windowElement.style.transform = "none";
    });

    document.addEventListener("mouseup", () => {
        if (!dragging) {
            return;
        }

        dragging = false;
        headerElement.style.cursor = "grab";
    });
}

function makeMaximizable(windowElement, maximizeButton) {
    if (!windowElement || !maximizeButton) {
        return;
    }

    let maximized = false;

    let previousState = {
        left: "",
        top: "",
        width: "",
        height: "",
        transform: ""
    };

    maximizeButton.addEventListener("click", () => {
        if (!maximized) {
            previousState = {
                left: windowElement.style.left,
                top: windowElement.style.top,
                width: windowElement.style.width,
                height: windowElement.style.height,
                transform: windowElement.style.transform
            };

            windowElement.classList.add("maximized");

            windowElement.style.left = "0";
            windowElement.style.top = "0";
            windowElement.style.width = "100%";
            windowElement.style.height = "calc(100% - 80px)";
            windowElement.style.transform = "none";

            maximizeButton.textContent = "❐";

            maximized = true;
        } else {
            windowElement.classList.remove("maximized");

            windowElement.style.left = previousState.left || "";
            windowElement.style.top = previousState.top || "";
            windowElement.style.width = previousState.width || "";
            windowElement.style.height = previousState.height || "";
            windowElement.style.transform = previousState.transform || "";

            maximizeButton.textContent = "□";

            maximized = false;
        }

        bringToFront(windowElement);
    });
}

function setupWindow(name) {
    const icon = document.getElementById(`${name}-icon`);
    const windowElement = document.getElementById(`${name}-window`);
    const closeButton = document.getElementById(`${name}-close`);
    const minimizeButton = document.getElementById(`${name}-minimize`);
    const maximizeButton = document.getElementById(`${name}-maximize`);
    const header = document.getElementById(`${name}-header`);

    if (!windowElement) {
        return null;
    }

    if (icon) {
        icon.addEventListener("click", () => {
            openWindow(windowElement);
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            closeWindow(windowElement);
        });
    }

    if (minimizeButton) {
        minimizeButton.addEventListener("click", () => {
            minimizeWindow(windowElement);
        });
    }

    if (header) {
        makeDraggable(windowElement, header);
    }

    if (maximizeButton) {
        makeMaximizable(windowElement, maximizeButton);
    }

    windowElement.addEventListener("mousedown", () => {
        bringToFront(windowElement);
    });

    return windowElement;
}

const browserWindow = setupWindow("browser");
const filesWindow = setupWindow("files");
const notesWindow = setupWindow("notes");
const musicWindow = setupWindow("music");
const settingsWindow = setupWindow("settings");
const paintWindow = setupWindow("paint");
const calculatorWindow = setupWindow("calculator");
setupWindow("stopwatch");

const calculatorDisplay = document.getElementById("calculator-display");
const calculatorHistory = document.getElementById("calculator-history");
const calculatorButtons = document.querySelector(".calculator-buttons");

if (calculatorDisplay && calculatorHistory && calculatorButtons) {
    let calculatorExpression = "";
    let calculatorResultShown = false;

    function renderCalculator() {
        calculatorDisplay.textContent = calculatorExpression || "0";
    }

    function calculateExpression(expression) {
        const tokens = expression.match(/(?:\d+\.?\d*|\.\d+|[+\-*/%])/g) || [];

        if (tokens.join("") !== expression) {
            throw new Error("Invalid expression");
        }

        let tokenIndex = 0;

        function parseNumber() {
            const token = tokens[tokenIndex++];

            if (!token || !/^\d*\.?\d+$/.test(token) && !/^\d+\.$/.test(token)) {
                throw new Error("Expected a number");
            }

            let value = Number(token);

            while (tokens[tokenIndex] === "%") {
                value /= 100;
                tokenIndex++;
            }

            return value;
        }

        function parseUnary() {
            if (tokens[tokenIndex] === "+") {
                tokenIndex++;
                return parseUnary();
            }

            if (tokens[tokenIndex] === "-") {
                tokenIndex++;
                return -parseUnary();
            }

            return parseNumber();
        }

        function parseTerm() {
            let value = parseUnary();

            while (tokens[tokenIndex] === "*" || tokens[tokenIndex] === "/") {
                const operator = tokens[tokenIndex++];
                const right = parseUnary();

                if (operator === "/" && right === 0) {
                    throw new Error("Division by zero");
                }

                value = operator === "*" ? value * right : value / right;
            }

            return value;
        }

        function parseSum() {
            let value = parseTerm();

            while (tokens[tokenIndex] === "+" || tokens[tokenIndex] === "-") {
                const operator = tokens[tokenIndex++];
                const right = parseTerm();
                value = operator === "+" ? value + right : value - right;
            }

            return value;
        }

        const result = parseSum();

        if (tokenIndex !== tokens.length || !Number.isFinite(result)) {
            throw new Error("Invalid expression");
        }

        return Number(result.toPrecision(12)).toString();
    }

    function handleCalculatorInput(value) {
        if (value === "clear") {
            calculatorExpression = "";
            calculatorHistory.textContent = "";
            calculatorResultShown = false;
        } else if (value === "delete") {
            calculatorExpression = calculatorExpression.slice(0, -1);
            calculatorResultShown = false;
        } else if (value === "calculate") {
            if (!calculatorExpression) {
                return;
            }

            try {
                const result = calculateExpression(calculatorExpression);
                calculatorHistory.textContent = `${calculatorExpression} =`;
                calculatorExpression = result;
                calculatorResultShown = true;
            } catch {
                calculatorHistory.textContent = calculatorExpression;
                calculatorExpression = "Error";
                calculatorResultShown = true;
            }
        } else if (/^\d$/.test(value) || value === ".") {
            if (calculatorResultShown || calculatorExpression === "Error") {
                calculatorExpression = "";
                calculatorHistory.textContent = "";
            }

            if (value === ".") {
                const currentNumber = calculatorExpression.split(/[+\-*/%]/).pop();

                if (currentNumber.includes(".")) {
                    return;
                }

                if (!currentNumber) {
                    calculatorExpression += "0";
                }
            }

            calculatorExpression += value;
            calculatorResultShown = false;
        } else if (["+", "-", "*", "/", "%"].includes(value)) {
            if (calculatorExpression === "Error") {
                calculatorExpression = "";
            }

            if (calculatorResultShown && value !== "%") {
                calculatorResultShown = false;
            }

            calculatorExpression += value;
        }

        renderCalculator();
    }

    calculatorButtons.addEventListener("click", (event) => {
        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        handleCalculatorInput(button.dataset.action || button.dataset.value);
    });

    document.addEventListener("keydown", (event) => {
        if (!calculatorWindow || calculatorWindow.style.display !== "flex") {
            return;
        }

        if (/^\d$/.test(event.key) || [".", "+", "-", "*", "/", "%"].includes(event.key)) {
            event.preventDefault();
            handleCalculatorInput(event.key);
        } else if (event.key === "Enter" || event.key === "=") {
            event.preventDefault();
            handleCalculatorInput("calculate");
        } else if (event.key === "Backspace") {
            event.preventDefault();
            handleCalculatorInput("delete");
        } else if (event.key === "Escape") {
            handleCalculatorInput("clear");
        }
    });
}

const stopwatchDisplay = document.getElementById("stopwatch-display");
const stopwatchStart = document.getElementById("stopwatch-start");
const stopwatchReset = document.getElementById("stopwatch-reset");

if (stopwatchDisplay && stopwatchStart && stopwatchReset) {
    let elapsedMilliseconds = 0;
    let startedAt = 0;
    let animationFrame = null;

    function renderStopwatch(milliseconds) {
        const tenths = Math.floor(milliseconds / 100);
        const minutes = Math.floor(tenths / 600);
        const seconds = Math.floor(tenths / 10) % 60;
        const fraction = tenths % 10;

        stopwatchDisplay.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${fraction}`;
    }

    function updateStopwatch() {
        renderStopwatch(elapsedMilliseconds + performance.now() - startedAt);
        animationFrame = requestAnimationFrame(updateStopwatch);
    }

    stopwatchStart.addEventListener("click", () => {
        if (animationFrame !== null) {
            elapsedMilliseconds += performance.now() - startedAt;
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
            stopwatchStart.textContent = "Start";
            return;
        }

        startedAt = performance.now();
        stopwatchStart.textContent = "Pause";
        animationFrame = requestAnimationFrame(updateStopwatch);
    });

    stopwatchReset.addEventListener("click", () => {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        elapsedMilliseconds = 0;
        stopwatchStart.textContent = "Start";
        renderStopwatch(0);
    });
}

const paintCanvas = document.getElementById("paint-canvas");
const paintColor = document.getElementById("paint-color");
const paintSize = document.getElementById("paint-size");
const paintEraser = document.getElementById("paint-eraser");
const paintUndo = document.getElementById("paint-undo");
const paintClear = document.getElementById("paint-clear");
const paintSave = document.getElementById("paint-save");

if (
    paintCanvas && paintColor && paintSize && paintEraser &&
    paintUndo && paintClear && paintSave
) {
    const paintContext = paintCanvas.getContext("2d", {
        willReadFrequently: true
    });
    const undoStack = [];
    let drawing = false;
    let erasing = false;
    let canvasReady = false;

    function resizePaintCanvas() {
        const bounds = paintCanvas.getBoundingClientRect();

        if (!bounds.width || !bounds.height) {
            return;
        }

        const pixelRatio = window.devicePixelRatio || 1;
        const width = Math.round(bounds.width * pixelRatio);
        const height = Math.round(bounds.height * pixelRatio);

        if (paintCanvas.width === width && paintCanvas.height === height) {
            return;
        }

        const previousCanvas = canvasReady ? document.createElement("canvas") : null;

        if (previousCanvas) {
            previousCanvas.width = paintCanvas.width;
            previousCanvas.height = paintCanvas.height;
            previousCanvas.getContext("2d").drawImage(paintCanvas, 0, 0);
        }

        paintCanvas.width = width;
        paintCanvas.height = height;
        paintContext.setTransform(1, 0, 0, 1, 0, 0);
        paintContext.fillStyle = "#ffffff";
        paintContext.fillRect(0, 0, width, height);

        if (previousCanvas) {
            paintContext.drawImage(previousCanvas, 0, 0, width, height);
            undoStack.length = 0;
        }

        paintContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        paintContext.lineCap = "round";
        paintContext.lineJoin = "round";
        canvasReady = true;
    }

    function savePaintSnapshot() {
        undoStack.push(
            paintContext.getImageData(0, 0, paintCanvas.width, paintCanvas.height)
        );

        if (undoStack.length > 30) {
            undoStack.shift();
        }
    }

    function getPaintPoint(event) {
        const bounds = paintCanvas.getBoundingClientRect();

        return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
        };
    }

    paintCanvas.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        savePaintSnapshot();
        drawing = true;
        paintCanvas.setPointerCapture(event.pointerId);

        const point = getPaintPoint(event);
        paintContext.beginPath();
        paintContext.moveTo(point.x, point.y);
        paintContext.lineTo(point.x, point.y);
        paintContext.strokeStyle = erasing ? "#ffffff" : paintColor.value;
        paintContext.lineWidth = Number(paintSize.value);
        paintContext.stroke();
    });

    paintCanvas.addEventListener("pointermove", (event) => {
        if (!drawing) {
            return;
        }

        const point = getPaintPoint(event);
        paintContext.lineTo(point.x, point.y);
        paintContext.stroke();
    });

    function stopPaintStroke() {
        drawing = false;
        paintContext.closePath();
    }

    paintCanvas.addEventListener("pointerup", stopPaintStroke);
    paintCanvas.addEventListener("pointercancel", stopPaintStroke);

    paintEraser.addEventListener("click", () => {
        erasing = !erasing;
        paintEraser.textContent = erasing ? "Draw" : "Eraser";
        paintEraser.setAttribute("aria-pressed", String(erasing));
    });

    paintUndo.addEventListener("click", () => {
        const previousImage = undoStack.pop();

        if (previousImage) {
            paintContext.putImageData(previousImage, 0, 0);
        }
    });

    paintClear.addEventListener("click", () => {
        savePaintSnapshot();
        paintContext.save();
        paintContext.setTransform(1, 0, 0, 1, 0, 0);
        paintContext.fillStyle = "#ffffff";
        paintContext.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
        paintContext.restore();
    });

    paintSave.addEventListener("click", () => {
        paintCanvas.toBlob((blob) => {
            if (!blob) {
                return;
            }

            const downloadUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = downloadUrl;
            downloadLink.download = "cobraos-paint.png";
            downloadLink.click();
            URL.revokeObjectURL(downloadUrl);
        }, "image/png");
    });

    if ("ResizeObserver" in window) {
        new ResizeObserver(resizePaintCanvas).observe(
            document.querySelector(".paint-canvas-container")
        );
    } else {
        window.addEventListener("resize", resizePaintCanvas);
    }

    const paintIcon = document.getElementById("paint-icon");

    if (paintIcon) {
        paintIcon.addEventListener("click", () => {
            requestAnimationFrame(resizePaintCanvas);
        });
    }
}

const browserFrame = document.getElementById("browser-frame");
const browserUrl = document.getElementById("browser-url");
const browserGo = document.getElementById("browser-go");

function openBrowser(url) {
    if (!browserFrame) {
        return;
    }

    let address = url.trim();

    if (!address) {
        return;
    }

    if (!/^https?:\/\//i.test(address)) {
        address = `https://${address}`;
    }

    browserFrame.src = address;
}

if (browserGo && browserUrl) {
    browserGo.addEventListener("click", () => {
        openBrowser(browserUrl.value);
    });
}

if (browserUrl) {
    browserUrl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            openBrowser(browserUrl.value);
        }
    });
}

const notesEditor = document.getElementById("notes-editor");
const notesClear = document.getElementById("notes-clear");
const notesStatus = document.getElementById("notes-status");

if (notesEditor) {
    const savedNotes = localStorage.getItem("cobraos-notes");

    if (savedNotes) {
        notesEditor.value = savedNotes;
    }

    notesEditor.addEventListener("input", () => {
        localStorage.setItem("cobraos-notes", notesEditor.value);

        if (notesStatus) {
            notesStatus.textContent = "Saved";
        }
    });
}

if (notesClear && notesEditor) {
    notesClear.addEventListener("click", () => {
        notesEditor.value = "";
        localStorage.removeItem("cobraos-notes");

        if (notesStatus) {
            notesStatus.textContent = "Cleared";
        }
    });
}

const musicPlay = document.getElementById("music-play");
const musicPrevious = document.getElementById("music-previous");
const musicNext = document.getElementById("music-next");
const musicProgress = document.getElementById("music-progress");
const musicVolume = document.getElementById("music-volume");
const musicFileInput = document.getElementById("music-file-input");
const musicTitle = document.getElementById("music-title");
const musicArtist = document.getElementById("music-artist");
const musicCurrentTime = document.getElementById("music-current-time");
const musicDuration = document.getElementById("music-duration");

const musicAudio = new Audio();

let musicObjectURL = null;

function formatMusicTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

if (musicPlay) {
    musicPlay.addEventListener("click", async () => {
        if (!musicAudio.src) {
            return;
        }

        try {
            if (musicAudio.paused) {
                await musicAudio.play();
            } else {
                musicAudio.pause();
            }
        } catch (error) {
            console.error("Unable to play audio:", error);
        }
    });
}

musicAudio.addEventListener("play", () => {
    if (musicPlay) {
        musicPlay.textContent = "⏸";
    }
});

musicAudio.addEventListener("pause", () => {
    if (musicPlay) {
        musicPlay.textContent = "▶";
    }
});

if (musicFileInput) {
    musicFileInput.addEventListener("change", () => {
        const file = musicFileInput.files[0];

        if (!file) {
            return;
        }

        if (musicObjectURL) {
            URL.revokeObjectURL(musicObjectURL);
        }

        musicObjectURL = URL.createObjectURL(file);
        musicAudio.src = musicObjectURL;

        if (musicTitle) {
            musicTitle.textContent = file.name;
        }

        if (musicArtist) {
            musicArtist.textContent = "Local file";
        }

        musicAudio.load();
    });
}

musicAudio.addEventListener("loadedmetadata", () => {
    if (musicProgress) {
        musicProgress.max = musicAudio.duration;
        musicProgress.value = 0;
    }

    if (musicDuration) {
        musicDuration.textContent = formatMusicTime(musicAudio.duration);
    }
});

musicAudio.addEventListener("timeupdate", () => {
    if (musicProgress) {
        musicProgress.value = musicAudio.currentTime;
    }

    if (musicCurrentTime) {
        musicCurrentTime.textContent =
            formatMusicTime(musicAudio.currentTime);
    }
});

if (musicProgress) {
    musicProgress.addEventListener("input", () => {
        musicAudio.currentTime = Number(musicProgress.value);
    });
}

if (musicVolume) {
    musicAudio.volume = Number(musicVolume.value);

    musicVolume.addEventListener("input", () => {
        musicAudio.volume = Number(musicVolume.value);
    });
}

if (musicPrevious) {
    musicPrevious.addEventListener("click", () => {
        musicAudio.currentTime = 0;
    });
}

if (musicNext) {
    musicNext.addEventListener("click", () => {
        musicAudio.currentTime = 0;
    });
}

musicAudio.addEventListener("ended", () => {
    if (musicProgress) {
        musicProgress.value = 0;
    }

    if (musicCurrentTime) {
        musicCurrentTime.textContent = "0:00";
    }

    if (musicPlay) {
        musicPlay.textContent = "▶";
    }
});

const settingsNav = document.querySelectorAll(".settings-nav");
const settingsSections = document.querySelectorAll(".settings-section");

settingsNav.forEach((nav) => {
    nav.addEventListener("click", () => {
        const section = nav.dataset.section;
        const selectedSection = document.getElementById(
            `settings-${section}`
        );

        if (!selectedSection) {
            return;
        }

        settingsNav.forEach((item) => {
            item.classList.remove("active");
        });

        settingsSections.forEach((item) => {
            item.classList.remove("active");
        });

        nav.classList.add("active");
        selectedSection.classList.add("active");
    });
});

const themeSelect = document.getElementById("theme-select");
const accentColor = document.getElementById("accent-color");
const animationsToggle = document.getElementById("animations-toggle");

function applyTheme(theme) {
    document.body.dataset.theme = theme;
}

if (themeSelect) {
    const savedTheme = localStorage.getItem("cobraos-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
    } else {
        applyTheme(themeSelect.value);
    }

    themeSelect.addEventListener("change", () => {
        const theme = themeSelect.value;

        localStorage.setItem("cobraos-theme", theme);
        applyTheme(theme);
    });
}

if (accentColor) {
    const savedAccent = localStorage.getItem("cobraos-accent");

    if (savedAccent) {
        accentColor.value = savedAccent;
    }

    document.documentElement.style.setProperty(
        "--accent-color",
        accentColor.value
    );

    accentColor.addEventListener("input", () => {
        const color = accentColor.value;

        document.documentElement.style.setProperty(
            "--accent-color",
            color
        );

        localStorage.setItem("cobraos-accent", color);
    });
}

if (animationsToggle) {
    const savedAnimations =
        localStorage.getItem("cobraos-animations");

    if (savedAnimations !== null) {
        animationsToggle.checked = savedAnimations === "true";
    }

    animationsToggle.addEventListener("change", () => {
        localStorage.setItem(
            "cobraos-animations",
            animationsToggle.checked
        );

        document.body.classList.toggle(
            "no-animations",
            !animationsToggle.checked
        );
    });
}

function updateSettingsNetwork() {
    const status = document.getElementById(
        "settings-network-status"
    );

    const icon = document.getElementById(
        "settings-network-icon"
    );

    if (!status || !icon) {
        return;
    }

    if (navigator.onLine) {
        status.textContent = "Connected to the internet";
        icon.textContent = "📶";
    } else {
        status.textContent = "No internet connection";
        icon.textContent = "❌";
    }
}

updateSettingsNetwork();

window.addEventListener("online", updateSettingsNetwork);
window.addEventListener("offline", updateSettingsNetwork);

async function updateSettingsBattery() {
    const batteryLevel = document.getElementById(
        "settings-battery-level"
    );

    if (!batteryLevel || !navigator.getBattery) {
        return;
    }

    try {
        const battery = await navigator.getBattery();

        function updateBatteryText() {
            const percentage = Math.round(battery.level * 100);

            batteryLevel.textContent = `${percentage}%`;
        }

        updateBatteryText();

        battery.addEventListener(
            "levelchange",
            updateBatteryText
        );
    } catch {
        batteryLevel.textContent = "Unavailable";
    }
}

updateSettingsBattery();

window.addEventListener("beforeunload", () => {
    if (musicObjectURL) {
        URL.revokeObjectURL(musicObjectURL);
    }
});


const fileGrid = document.getElementById("file-grid");
const filesPath = document.getElementById("files-path");
const filesBack = document.getElementById("files-back");
const createFolderButton = document.getElementById("create-folder");
const fileUpload = document.getElementById("file-upload");

let currentPath = [];

let fileSystem = JSON.parse(
    localStorage.getItem("cobraos-filesystem")
) || {
    type: "folder",
    name: "Home",
    children: [
        {
            type: "folder",
            name: "Desktop",
            children: []
        },
        {
            type: "folder",
            name: "Documents",
            children: []
        },
        {
            type: "folder",
            name: "Downloads",
            children: []
        },
        {
            type: "folder",
            name: "Music",
            children: []
        }
    ]
};

function saveFileSystem() {
    localStorage.setItem(
        "cobraos-filesystem",
        JSON.stringify(fileSystem)
    );
}

function getCurrentFolder() {
    let folder = fileSystem;

    for (const folderName of currentPath) {
        const nextFolder = folder.children.find(
            item =>
                item.type === "folder" &&
                item.name === folderName
        );

        if (!nextFolder) {
            return fileSystem;
        }

        folder = nextFolder;
    }

    return folder;
}



const filesLocations = document.querySelectorAll(".files-location");

function updateFileSidebar() {

    filesLocations.forEach((location) => {

        const folderName = location.dataset.folder;

        location.classList.toggle(
            "active",
            currentPath.length === 0
                ? folderName === "Home"
                : folderName === currentPath[0]
        );

    });
}


function renderFiles() {
    if (!fileGrid) {
        return;
    }

    const folder = getCurrentFolder();

    fileGrid.innerHTML = "";

    if (filesPath) {
        filesPath.textContent =
            currentPath.length === 0
                ? "Home"
                : `Home / ${currentPath.join(" / ")}`;
    }

    if (filesBack) {
        filesBack.disabled = currentPath.length === 0;
    }

    folder.children.forEach((item, index) => {
        const element = document.createElement("div");

        element.className =
            `file-item ${item.type}`;

        const icon = document.createElement("div");

        icon.className = "file-icon";

        icon.textContent =
            item.type === "folder"
                ? "📁"
                : getFileIcon(item.name);

        const name = document.createElement("span");

        name.className = "file-name";
        name.textContent = item.name;

        const deleteButton =
            document.createElement("button");

        deleteButton.className = "file-delete";
        deleteButton.textContent = "×";
        deleteButton.title = "Delete";

        deleteButton.addEventListener("click", event => {
            event.stopPropagation();

            const confirmed = confirm(
                `Delete "${item.name}"?`
            );

            if (!confirmed) {
                return;
            }

            folder.children.splice(index, 1);

            saveFileSystem();
            renderFiles();
        });

        element.appendChild(icon);
        element.appendChild(name);
        element.appendChild(deleteButton);

        if (item.type === "folder") {
            element.addEventListener("dblclick", () => {

                currentPath.push(item.name);

                updateFileSidebar();

                renderFiles();
            });
        }

        fileGrid.appendChild(element);
    });
}

function getFileIcon(filename) {
    const extension =
        filename.split(".").pop().toLowerCase();

    const icons = {
        pdf: "📕",
        txt: "📄",
        doc: "📘",
        docx: "📘",
        jpg: "🖼️",
        jpeg: "🖼️",
        png: "🖼️",
        gif: "🖼️",
        mp3: "🎵",
        wav: "🎵",
        mp4: "🎬",
        webm: "🎬",
        zip: "🗜️",
        rar: "🗜️",
        js: "📜",
        html: "🌐",
        css: "🎨",
        json: "📋"
    };

    return icons[extension] || "📄";
}

if (createFolderButton) {
    createFolderButton.addEventListener("click", () => {
        const name = prompt("Enter folder name:");

        if (!name) {
            return;
        }

        const folder = getCurrentFolder();

        const exists = folder.children.some(
            item => item.name === name
        );

        if (exists) {
            alert("A file or folder with that name already exists.");
            return;
        }

        folder.children.push({
            type: "folder",
            name: name,
            children: []
        });

        saveFileSystem();
        renderFiles();
    });
}

if (fileUpload) {
    fileUpload.addEventListener("change", () => {
        const files = Array.from(fileUpload.files);

        if (!files.length) {
            return;
        }

        const folder = getCurrentFolder();

        files.forEach(file => {
            const exists = folder.children.some(
                item => item.name === file.name
            );

            if (exists) {
                return;
            }

            folder.children.push({
                type: "file",
                name: file.name,
                size: file.size,
                typeName: file.type
            });
        });

        saveFileSystem();

        fileUpload.value = "";

        renderFiles();
    });




}

if (filesBack) {
    filesBack.addEventListener("click", () => {

        if (currentPath.length === 0) {
            return;
        }

        currentPath.pop();

        updateFileSidebar();

        renderFiles();
    });
}


filesLocations.forEach((location) => {

    location.addEventListener("click", () => {

        const folderName = location.dataset.folder;

        if (!folderName) {
            return;
        }

        
        if (folderName === "Home") {
            currentPath = [];
        } else {

            const folderExists = fileSystem.children.some(
                item =>
                    item.type === "folder" &&
                    item.name === folderName
            );

            if (!folderExists) {
                return;
            }


            currentPath = [folderName];
        }

        filesLocations.forEach((item) => {
            item.classList.remove("active");
        });

        location.classList.add("active");

        renderFiles();
    });

});
   

updateFileSidebar();
renderFiles();

/* =================================
   COBRAOS DESKTOP CALENDAR
================================= */

(() => {
    const monthElement = document.getElementById("calendar-month");
    const daysElement = document.getElementById("calendar-days");
    const todayElement = document.getElementById("calendar-today");
    const previousButton = document.getElementById("calendar-prev");
    const nextButton = document.getElementById("calendar-next");

    if (
        !monthElement || !daysElement || !todayElement ||
        !previousButton || !nextButton
    ) {
        return;
    }

    const today = new Date();
    let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = new Date(today);

    const monthFormatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
    });
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    function sameDate(firstDate, secondDate) {
        return firstDate.getFullYear() === secondDate.getFullYear() &&
            firstDate.getMonth() === secondDate.getMonth() &&
            firstDate.getDate() === secondDate.getDate();
    }

    function renderCalendar() {
        monthElement.textContent = monthFormatter.format(displayedMonth);
        daysElement.replaceChildren();

        const year = displayedMonth.getFullYear();
        const month = displayedMonth.getMonth();
        const firstWeekday = new Date(year, month, 1).getDay();
        const startDate = new Date(year, month, 1 - firstWeekday);

        for (let dayOffset = 0; dayOffset < 42; dayOffset++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + dayOffset);

            const dayButton = document.createElement("button");
            const isSelected = sameDate(date, selectedDate);

            dayButton.type = "button";
            dayButton.textContent = date.getDate();
            dayButton.setAttribute("aria-label", dateFormatter.format(date));
            dayButton.setAttribute("aria-pressed", String(isSelected));

            if (date.getMonth() !== month) {
                dayButton.classList.add("other-month");
            }
            if (sameDate(date, today)) {
                dayButton.classList.add("today");
            }
            if (isSelected) {
                dayButton.classList.add("selected");
            }

            dayButton.addEventListener("click", () => {
                selectedDate = new Date(date);
                displayedMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                renderCalendar();
            });

            daysElement.appendChild(dayButton);
        }

        todayElement.textContent = sameDate(selectedDate, today)
            ? `Today · ${dateFormatter.format(today)}`
            : `Selected · ${dateFormatter.format(selectedDate)}`;
    }

    previousButton.addEventListener("click", () => {
        displayedMonth = new Date(
            displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1
        );
        renderCalendar();
    });

    nextButton.addEventListener("click", () => {
        displayedMonth = new Date(
            displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1
        );
        renderCalendar();
    });

    renderCalendar();
})();

