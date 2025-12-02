import * as path from "path";
import { spawn } from "child_process";
import { contextBridge } from "electron";
let monitorProcess;
contextBridge.exposeInMainWorld("monitorControl", {
    startMonitor: () => {
        const exePath = path.join(__dirname, "../monitor/LibreHardwareMonitor.exe");
        monitorProcess = spawn(exePath, [], {
            detached: false,
            windowsHide: true,
            stdio: "ignore"
        });
        monitorProcess.on("error", (err) => {
            console.error("Failed to start LibreHardwareMonitor:", err);
        });
        console.log("LibreHardwareMonitor started.");
    },
    stopMonitor: () => {
        if (monitorProcess) {
            try {
                monitorProcess.kill();
                monitorProcess = null;
                console.log("LibreHardwareMonitor stopped.");
            }
            catch (err) {
                console.error("Failed to stop LibreHardwareMonitor." + err);
            }
        }
    }
});
//# sourceMappingURL=preload-monitor-runner.js.map