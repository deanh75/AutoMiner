import { contextBridge } from "electron";
import * as si from "systeminformation";
import * as os from "os";
function filterPhysicalGPUs(controllers) {
    return controllers.filter(g => (g.vram ?? 0) > 0); // must have VRAM
}
contextBridge.exposeInMainWorld("systemInfo", {
    getCPU: async () => {
        const cpu = await si.cpu();
        return cpu.brand ?? "Unknown CPU";
    },
    getCPUTemp: async () => {
        const temp = await si.cpuTemperature();
        return temp?.main ?? "N/A";
    },
    getGPU: async () => {
        const graphics = await si.graphics();
        const physicalGPUs = filterPhysicalGPUs(graphics.controllers ?? []);
        return physicalGPUs.map(g => g.model).join(", ") || "No GPU found";
    },
    getGPUTemp: async () => {
        const graphics = await si.graphics();
        const physicalGPUs = filterPhysicalGPUs(graphics.controllers ?? []);
        return physicalGPUs.map(g => g.temperatureGpu).join(", ") || "N/A";
    },
    getUptime: async () => {
        return os.uptime();
    }
});
//# sourceMappingURL=preload.js.map