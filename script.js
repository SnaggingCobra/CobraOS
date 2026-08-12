const startButton = document.getElementById("start-button");

const welcomeScreen = document.querySelector(".welcome-screen");
const desktop = document.querySelector(".desktop");

startButton.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    desktop.style.display = "block";
});


// DATE

function updateDate() {

    const dateElement = document.getElementById("date");

    const now = new Date();

    dateElement.textContent = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}


// TIME

function updateTime() {

    const timeElement = document.getElementById("clock");

    const now = new Date();

    timeElement.textContent = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}


updateDate();
updateTime();

setInterval(updateTime, 1000);

async function updateBattery() {

    const batteryElement = document.getElementById("battery");

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