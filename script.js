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

    if (!timeElement) {
        return;
    }

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

