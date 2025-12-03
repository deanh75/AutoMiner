let lastTempUnit = "";
let lastPort = "";

const tempDropdown = document.getElementById("temp-units") as HTMLSelectElement;
const portInput = document.getElementById("portInput") as HTMLInputElement;

async function saveHardwareSettings() {
    if (!window.monitorSettings) return;
    if (!window.monitorControl) return;
    if (!window.ipSettings) return;

    window.monitorSettings.writeConfigValue("TemperatureUnit", tempDropdown.value === "C" ? "0" : "1");
    window.monitorSettings.writeConfigValue("listenerPort", portInput.value);

    window.monitorControl.stopMonitor();
    setTimeout(() => window.monitorControl.startMonitor(), 250);

    console.log("Setting IP port to:", portInput.value);
    window.ipSettings.setPort(parseInt(portInput.value, 10));
}

async function readHardwareSettings() {
    if (!window.monitorSettings) return;
    if (!window.ipSettings) return;

    tempDropdown.value = await window.monitorSettings.readConfigValue("TemperatureUnit") === "0" ? "C" : "F";
    lastTempUnit = tempDropdown.value;

    const address = await window.monitorSettings.readConfigValue("listenerIp")
    console.log("Setting IP address to:", address);
    window.ipSettings.setIpAddress(address);

    const port = await window.monitorSettings.readConfigValue("listenerPort");
    portInput.value = port;
    lastPort = port;
    console.log("Set port input to:", port);
    window.ipSettings.setPort(parseInt(port, 10));
}

tempDropdown.addEventListener("change", async () => {
    if (tempDropdown.value !== lastTempUnit) {
        saveHardwareSettings();
        lastTempUnit = tempDropdown.value;
    }
});
portInput.addEventListener("change", async () => {
    if (portInput.value !== lastPort) {
        saveHardwareSettings();
        lastPort = portInput.value;
    }
});

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        console.log("Calling readHardwareSettings...");
        readHardwareSettings();
    }, 100);
});

window.monitorControl.startMonitor()