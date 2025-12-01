import { app, BrowserWindow } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// __dirname replacement in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appStartTime = Date.now();

let monitorProcess: any;

function startMonitor() {
    const exePath = path.join(__dirname, "../monitor/LibreHardwareMonitor.exe");

    monitorProcess = spawn(exePath, [], {
        detached: false,
        windowsHide: true,
        stdio: "ignore"
    });

    monitorProcess.on("error", (err: any) => {
        console.error("Failed to start LibreHardwareMonitor:", err);
    });

    console.log("LibreHardwareMonitor started.");
}

function stopMonitor() {
    if (monitorProcess) {
        try {
            monitorProcess.kill();
            monitorProcess = null;
            console.log("LibreHardwareMonitor stopped.");
        } catch (err) {
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
            preload: path.join(__dirname, "stat-loader.js"),
            nodeIntegration: true,    // allow Node modules in renderer
            contextIsolation: true    // enables context bridge
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
    if (process.platform !== "darwin") app.quit();
});