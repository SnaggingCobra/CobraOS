const startButton = document.getElementById("start-button");

const welcomeScreen = document.querySelector(".welcome-screen");
const desktop = document.querySelector(".desktop");

startButton.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    desktop.style.display = "block";
});