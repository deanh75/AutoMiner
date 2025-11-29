import { app, BrowserWindow } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
// __dirname replacement in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appStartTime = Date.now();
let monitorProcess;
function startMonitor() {
    const exePath = path.join(__dirname, "..", "monitor", "LibreHardwareMonitor.exe");
    monitorProcess = spawn(exePath, [], {
        detached: true,
        windowsHide: true,
        stdio: "ignore"
    });
    monitorProcess.on("error", (err) => {
        console.error("Failed to start LibreHardwareMonitor:", err);
    });
    console.log("LibreHardwareMonitor started.");
}
function stopMonitor() {
    if (monitorProcess) {
        try {
            monitorProcess.kill();
            console.log("LibreHardwareMonitor stopped.");
        }
        catch (err) {
            console.error("Failed to stop LibreHardwareMonitor." + err);
        }
    }
}
function createWindow() {
    startMonitor();
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true, // allow Node modules in renderer
            contextIsolation: true // enables context bridge
        }
    });
    win.loadFile(path.join(__dirname, "../ui/index.html"));
    win.webContents.on("did-finish-load", () => {
        win.webContents.send("startup-timestamp", appStartTime);
    });
    // win.webContents.openDevTools();
}
app.whenReady().then(createWindow);
app.on("will-quit", () => {
    stopMonitor();
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});
//# sourceMappingURL=main.js.map