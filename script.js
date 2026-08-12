
const startButton = document.getElementById("start-button");
const welcomeScreen = document.querySelector(".welcome-screen");
const desktop = document.querySelector(".desktop");

startButton.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    desktop.style.display = "block";
});

function updateDate() {

    const dateElement = document.getElementById("date");
    const now = new Date();

    dateElement.textContent = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

updateDate();

function updateTime() 
{

    const timeElement = document.getElementById("clock");
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}

updateTime();
setInterval(updateTime, 1000);

async function updateBattery() {

    const batteryElement = document.getElementById("battery");

    if (!batteryElement) {
        return;
    }

    if (!navigator.getBattery) {
        batteryElement.textContent = "🔋 --%";
        return;
    }

    const battery = await navigator.getBattery();
    function updateBatteryDisplay() {
        const percentage = Math.round(battery.level * 100);
        batteryElement.textContent = `🔋 ${percentage}%`;
    }
    updateBatteryDisplay();
    battery.addEventListener("levelchange", updateBatteryDisplay);
}
updateBattery();

function updateNetwork()
 {
    const networkElement = document.getElementById("network");
    if (!networkElement) {
        return;
    }
    if (navigator.onLine) {
        networkElement.textContent = "📶";
    } 
    else {
        networkElement.textContent = "❌";
    }
}
updateNetwork();

window.addEventListener("online", updateNetwork);
window.addEventListener("offline", updateNetwork);




const volumeButton = document.getElementById("volume");
const volumePopup = document.getElementById("volume-popup");
const volumeSlider = document.getElementById("volume-slider");
const volumeValue = document.getElementById("volume-value");


if (volumeButton && volumePopup) {

    volumeButton.addEventListener("click", () => {
        if (volumePopup.style.display === "flex") {
            volumePopup.style.display = "none";
        } 
        else {

            volumePopup.style.display = "flex";
        }
    });
}

if (volumeSlider && volumeValue) {

    volumeSlider.addEventListener("input", () => {
        const value = volumeSlider.value;
        volumeValue.textContent = `${value}%`;
        updateVolumeIcon(value);
    });
}
function updateVolumeIcon(value) {

    if (!volumeButton) {
        return;
    }

    if (value == 0) {
        volumeButton.textContent = "🔇";
    } 
    else if (value < 40) {
        volumeButton.textContent = "🔈";
    } 
    else if (value < 70) {

        volumeButton.textContent = "🔉";
    } 
    else 
        {
        volumeButton.textContent = "🔊";
        }
}

const browserIcon =
    document.getElementById("browser-icon");

const browserWindow =
    document.getElementById("browser-window");

const browserClose =
    document.getElementById("browser-close");

const browserMinimize =
    document.getElementById("browser-minimize");

const browserMaximize =
    document.getElementById("browser-maximize");

const browserHeader =
    document.getElementById("browser-header");

if (browserIcon && browserWindow) {

    browserIcon.addEventListener("click", () => {
        browserWindow.style.display = "flex";
        browserWindow.style.zIndex = "200";
    });
}

if (browserClose && browserWindow) {
    browserClose.addEventListener("click", () => {
        browserWindow.style.display = "none";
    });
}

if (browserMinimize && browserWindow) {

    browserMinimize.addEventListener("click", () => {
        browserWindow.style.display = "none";

    });

}

let isDragging = false;
let offsetX = 0;
let offsetY = 0;


if (browserHeader && browserWindow) 
    {
    browserHeader.addEventListener("mousedown", (event) => {

        if (event.target.closest(".window-controls")) {
            return;
        }
        isDragging = true;
        const rect =
            browserWindow.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        browserHeader.style.cursor = "grabbing";

    });
    document.addEventListener("mousemove", (event) => {
        if (!isDragging) {
            return;
        }
        browserWindow.style.left =
            `${event.clientX - offsetX}px`
        browserWindow.style.top =
            `${event.clientY - offsetY}px`;
        browserWindow.style.transform = "none";
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
        browserHeader.style.cursor = "grab";
    });
}

let browserMaximized = false;

if (browserMaximize && browserWindow) {
    browserMaximize.addEventListener("click", () => {

        if (!browserMaximized) 
            {

            browserWindow.style.left = "0";
            browserWindow.style.top = "0";
            browserWindow.style.width = "100%";
            browserWindow.style.height = "calc(100% - 80px)";
            browserWindow.style.transform = "none";
            browserMaximized = true;
            browserMaximize.textContent = "❐";
        } 
        else 
            {

            browserWindow.style.left = "50%";
            browserWindow.style.top = "15%";
            browserWindow.style.width = "70%";
            browserWindow.style.height = "65%";
            browserWindow.style.transform =
                "translateX(-50%)";
            browserMaximized = false;
            browserMaximize.textContent = "□";
            }
    });
}

// Files


const filesIcon =
    document.getElementById("files-icon");

const filesWindow =
    document.getElementById("files-window");

const filesClose =
    document.getElementById("files-close");

const filesMinimize =
    document.getElementById("files-minimize");

const filesMaximize =
    document.getElementById("files-maximize");

const filesHeader =
    document.getElementById("files-header");



if (filesIcon && filesWindow) 
    {

    filesIcon.addEventListener("click", () => {
        filesWindow.style.display = "flex";
        filesWindow.style.zIndex = "201";
    });
}



if (filesClose && filesWindow) 
    {

    filesClose.addEventListener("click", () => {
        filesWindow.style.display = "none";
    });
}




if (filesMinimize && filesWindow) 
    {

    filesMinimize.addEventListener("click", () => {
        filesWindow.style.display = "none";
    });

}


// NOTES


const notesIcon =
    document.getElementById("notes-icon");

const notesWindow =
    document.getElementById("notes-window");

const notesClose =
    document.getElementById("notes-close");

const notesMinimize =
    document.getElementById("notes-minimize");

const notesMaximize =
    document.getElementById("notes-maximize");

const notesEditor =
    document.getElementById("notes-editor");

const notesClear =
    document.getElementById("notes-clear");

const notesStatus =
    document.getElementById("notes-status");


    ////////////////////////////////////////
if (notesIcon && notesWindow) {

    notesIcon.addEventListener("click", () => {

        notesWindow.style.display = "flex";
        notesWindow.style.zIndex = "202";
    });

}


if (notesClose && notesWindow) {

    notesClose.addEventListener("click", () => {
        notesWindow.style.display = "none";

    });

}

if (notesMinimize && notesWindow) {

    notesMinimize.addEventListener("click", () => {
        notesWindow.style.display = "none";

    });

}

if (notesEditor) {

    const savedNotes =
        localStorage.getItem("cobraos-notes");

    if (savedNotes) 
        {
        notesEditor.value = savedNotes;
    }
}


if (notesEditor) 
    {
    notesEditor.addEventListener("input", () => {

        localStorage.setItem(
            "cobraos-notes",
            notesEditor.value
        );

        notesStatus.textContent = "Saved";
    });
}


if (notesClear) {

    notesClear.addEventListener("click", () => {
        notesEditor.value = "";
        localStorage.removeItem("cobraos-notes");
        notesStatus.textContent = "Cleared";
    });
}

// MUSIC


const musicIcon =
    document.getElementById("music-icon");

const musicWindow =
    document.getElementById("music-window");

const musicClose =
    document.getElementById("music-close");

const musicMinimize =
    document.getElementById("music-minimize");

const musicMaximize =
    document.getElementById("music-maximize");

const musicPlay =
    document.getElementById("music-play");

const musicPrevious =
    document.getElementById("music-previous");

const musicNext =
    document.getElementById("music-next");

const musicProgress =
    document.getElementById("music-progress");

const musicVolume =
    document.getElementById("music-volume");

const musicFileInput =
    document.getElementById("music-file-input");

const musicTitle =
    document.getElementById("music-title");

const musicArtist =
    document.getElementById("music-artist");

const musicCurrentTime =
    document.getElementById("music-current-time");

const musicDuration =
    document.getElementById("music-duration");


let musicAudio = new Audio();

let musicObjectURL = null;

let musicPlaying = false;


if (musicIcon && musicWindow) {

    musicIcon.addEventListener("click", () => {

        musicWindow.style.display = "flex";

        musicWindow.style.zIndex = "203";

    });

}

if (musicClose) {

    musicClose.addEventListener("click", () => {

        musicWindow.style.display = "none";

    });

}

if (musicMinimize) {

    musicMinimize.addEventListener("click", () => {

        musicWindow.style.display = "none";

    });

}



// PLAY / PAUSE


if (musicPlay) {

    musicPlay.addEventListener("click", () => {

        if (!musicAudio.src) {
            return;
        }

        if (musicPlaying) {
            musicAudio.pause();

        } else {
            musicAudio.play();

        }

    });

}



// PLAY

musicAudio.addEventListener("play", () => {
    musicPlaying = true;
    musicPlay.textContent = "⏸";

});

musicAudio.addEventListener("pause", () => {
    musicPlaying = false;
    musicPlay.textContent = "▶";

});

// LOAD MUSIC FILE


if (musicFileInput) {
    musicFileInput.addEventListener("change", () => {

        const file = musicFileInput.files[0];
        if (!file) {
            return;
        }
        if (musicObjectURL) {

            URL.revokeObjectURL(musicObjectURL);

        }
        musicObjectURL =
            URL.createObjectURL(file);

        musicAudio.src = musicObjectURL;

        musicTitle.textContent =
            file.name;

        musicArtist.textContent =
            "Local file";

        musicAudio.load();
    });

}

// DURATION


musicAudio.addEventListener("loadedmetadata", () => {

    musicProgress.max =
        musicAudio.duration;

    musicDuration.textContent =
        formatMusicTime(musicAudio.duration);

});



// PROGRESS

musicAudio.addEventListener("timeupdate", () => {

    musicProgress.value =
        musicAudio.currentTime;

    musicCurrentTime.textContent =
        formatMusicTime(musicAudio.currentTime);

});


if (musicProgress) {

    musicProgress.addEventListener("input", () => {
        musicAudio.currentTime =
            musicProgress.value;

    });

}

// VOLUME


if (musicVolume) {

    musicVolume.addEventListener("input", () => {

        musicAudio.volume =
            musicVolume.value;

    });

}


function formatMusicTime(seconds) {

    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;

}



// PREVIOUS / NEXT

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


// SETTINGS


const settingsIcon =
    document.getElementById("settings-icon");

const settingsWindow =
    document.getElementById("settings-window");

const settingsClose =
    document.getElementById("settings-close");

const settingsMinimize =
    document.getElementById("settings-minimize");

const settingsMaximize =
    document.getElementById("settings-maximize");


// OPEN SETTINGS

if (settingsIcon && settingsWindow) {

    settingsIcon.addEventListener("click", () => {

        settingsWindow.style.display = "flex";

        settingsWindow.style.zIndex = "204";

    });

}



// CLOSE

if (settingsClose) {

    settingsClose.addEventListener("click", () => {

        settingsWindow.style.display = "none";

    });

}


// MINIMIZE


if (settingsMinimize) {

    settingsMinimize.addEventListener("click", () => {

        settingsWindow.style.display = "none";

    });

}



// SETTINGS NAVIGATION

const settingsNav =
    document.querySelectorAll(".settings-nav");

const settingsSections =
    document.querySelectorAll(".settings-section");


settingsNav.forEach((nav) => {

    nav.addEventListener("click", () => {

        const section =
            nav.dataset.section;


        settingsNav.forEach((item) => {

            item.classList.remove("active");

        });


        settingsSections.forEach((item) => {

            item.classList.remove("active");

        });


        nav.classList.add("active");


        const selectedSection =
            document.getElementById(
                `settings-${section}`
            );


        if (selectedSection) {

            selectedSection.classList.add("active");

        }

    });

});


// THEME


const themeSelect =
    document.getElementById("theme-select");


const savedTheme =
    localStorage.getItem("cobraos-theme");


if (savedTheme) {

    themeSelect.value = savedTheme;

}


if (themeSelect) {

    themeSelect.addEventListener("change", () => {

        const theme =
            themeSelect.value;

        localStorage.setItem(
            "cobraos-theme",
            theme
        );

        document.body.dataset.theme =
            theme;

    });

}



// ACCENT COLOR


const accentColor =
    document.getElementById("accent-color");


const savedAccent =
    localStorage.getItem(
        "cobraos-accent"
    );


if (savedAccent) {

    accentColor.value =
        savedAccent;

    document.documentElement.style
        .setProperty(
            "--accent-color",
            savedAccent
        );

}


if (accentColor) {

    accentColor.addEventListener("input", () => {

        const color =
            accentColor.value;

        document.documentElement.style
            .setProperty(
                "--accent-color",
                color
            );

        localStorage.setItem(
            "cobraos-accent",
            color
        );

    });

}



// ANIMATIONS


const animationsToggle =
    document.getElementById(
        "animations-toggle"
    );


const savedAnimations =
    localStorage.getItem(
        "cobraos-animations"
    );


if (savedAnimations !== null) {

    animationsToggle.checked =
        savedAnimations === "true";

}


if (animationsToggle) {

    animationsToggle.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "cobraos-animations",
                animationsToggle.checked
            );

        }
    );

}


// NETWORK STATUS


function updateSettingsNetwork() {

    const status =
        document.getElementById(
            "settings-network-status"
        );

    const icon =
        document.getElementById(
            "settings-network-icon"
        );


    if (!status || !icon) {
        return;
    }


    if (navigator.onLine) {

        status.textContent =
            "Connected to the internet";

        icon.textContent =
            "📶";

    } else {

        status.textContent =
            "No internet connection";

        icon.textContent =
            "❌";

    }

}


updateSettingsNetwork();

window.addEventListener(
    "online",
    updateSettingsNetwork
);

window.addEventListener(
    "offline",
    updateSettingsNetwork
);


// BATTERY STATUS

async function updateSettingsBattery() {

    const batteryLevel =
        document.getElementById(
            "settings-battery-level"
        );


    if (!batteryLevel) {
        return;
    }


    if (!navigator.getBattery) {

        batteryLevel.textContent =
            "Battery information unavailable";

        return;

    }


    const battery =
        await navigator.getBattery();


    function updateBatteryText() {

        const percentage =
            Math.round(
                battery.level * 100
            );

        batteryLevel.textContent =
            `${percentage}%`;

    }


    updateBatteryText();


    battery.addEventListener(
        "levelchange",
        updateBatteryText
    );

}


updateSettingsBattery();