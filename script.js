
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

        if (!browserMaximized) {

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