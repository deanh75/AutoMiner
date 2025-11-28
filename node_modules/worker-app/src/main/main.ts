import { app, BrowserWindow } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";

// __dirname replacement in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,    // allow Node modules in renderer
            contextIsolation: true    // enables context bridge
        }
    });

    win.loadFile(path.join(__dirname, "../ui/index.html"));

    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});