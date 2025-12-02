let lastTempUnit = "";
let lastIpAddress = "";
const tempDropdown = document.getElementById("temp-units");
const ipDropdown = document.getElementById("ip-addresses");
async function saveHardwareSettings() {
    if (!window.monitorSettings)
        return;
    if (!window.monitorControl)
        return;
    if (!window.ipSettings)
        return;
    window.monitorSettings.writeConfigValue("TemperatureUnit", tempDropdown.value === "C" ? "0" : "1");
    const realAddress = ipDropdown.value === "default" ? "192.168.128.1" : ipDropdown.value;
    window.monitorSettings.writeConfigValue("listenerIp", realAddress);
    window.monitorControl.stopMonitor();
    setTimeout(() => window.monitorControl.startMonitor(), 250);
    window.ipSettings.setIpAddress(realAddress);
}
async function readHardwareSettings() {
    if (!window.monitorSettings)
        return;
    if (!window.ipSettings)
        return;
    tempDropdown.value = await window.monitorSettings.readConfigValue("TemperatureUnit") === "0" ? "C" : "F";
    lastTempUnit = tempDropdown.value;
    const address = await window.monitorSettings.readConfigValue("listenerIp");
    ipDropdown.value = address === "192.168.128.1" ? "default" : address;
    lastIpAddress = ipDropdown.value;
    window.ipSettings.setIpAddress(address);
}
tempDropdown.addEventListener("change", async () => {
    if (tempDropdown.value !== lastTempUnit) {
        saveHardwareSettings();
        lastTempUnit = tempDropdown.value;
    }
});
ipDropdown.addEventListener("change", async () => {
    if (ipDropdown.value !== lastIpAddress) {
        saveHardwareSettings();
        lastIpAddress = ipDropdown.value;
    }
});
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        console.log("Calling readHardwareSettings...");
        readHardwareSettings();
    }, 100);
});
window.monitorControl.startMonitor();
export {};
//# sourceMappingURL=hardware-settings.js.map