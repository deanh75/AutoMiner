import { contextBridge, ipcRenderer } from "electron";
import * as si from "systeminformation";

let startTime: number = 0;

ipcRenderer.on("startup-timestamp", (_, ts) => {
    startTime = ts;
});

contextBridge.exposeInMainWorld("appInfo", {
    getDynamicUptime: () => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);

    if (seconds < 60) {
        return `${seconds} sec`;
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        return `${minutes.toFixed(1)} min`;
    }

    const hours = minutes / 60;
    if (hours < 24) {
        return `${hours.toFixed(1)} hr`;
    }

    const days = hours / 24;
    return `${days.toFixed(1)} days`;
}
});

async function loadSensorData() {
    try {
        const response = await fetch("http://192.168.128.1:8085/data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

/**
 * Recursively search for a sensor node by Type and Text
 * Returns the Value if found, otherwise null
 */
function findValue(node: any | any[], type: string, text: string): string | null {
    if (!node) return null;

    const nodes = Array.isArray(node) ? node : [node];

    for (const n of nodes) {
        if (n.Type === type && n.Text === text) {
            return n.Value;
        }
        if (n.Children && n.Children.length > 0) {
            const val = findValue(n.Children, type, text);
            if (val !== null) return val;
        }
    }

    return null;
}
async function waitForValue(
    fetchFunc: () => Promise<any>, // function that fetches the JSON
    type: string,
    text: string,
    intervalMs: number = 250
): Promise<string> {
    while (true) {
        try {
            const data = await fetchFunc();
            const value = findValue(data, type, text);
            if (value !== null && value !== "") {
                return value; // found!
            }
        } catch (err) {
            console.error("Error fetching/waiting for value:", err);
        }

        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
}

function filterPhysicalGPUs(controllers: si.Systeminformation.GraphicsControllerData[]) {
    return controllers.filter(g => (g.vram ?? 0) > 0); // must have VRAM
}

contextBridge.exposeInMainWorld("systemInfo", {
    getCPUName: async () => {
        const cpu = await si.cpu();
        const cleaned = cpu.brand.replace(/\s\d+-Core Processor.*/i, '');
        return cleaned ?? "Unknown CPU";
    },
    getCPUSpecs: async () => {
        const cpu = await si.cpu();
        const match = cpu.brand.match(/\s\d+-Core Processor.*/i);
        return match ? match[0] : '';
    },
    getCPUTemp: async () => {
        const value = await waitForValue(() => loadSensorData(), "Temperature", "Core (Tctl/Tdie)") || "0%";
        return value;
    },
    getCPULoad: async () => {
        const value = await waitForValue(() => loadSensorData(), "Load", "CPU Total") || "0%";
        return value;
    },
    getGPU: async () => {
        const graphics = await si.graphics();
        const physicalGPUs = filterPhysicalGPUs(graphics.controllers ?? []);
        return physicalGPUs.map(g => g.model).join(", ") || "No GPU found";
    },
    getGPUTemp: async () => {
        const value = await waitForValue(() => loadSensorData(), "Temperature", "GPU Core") || "N/A";
        return value;
    },
    getGPUClock: async () => {
        const value = await waitForValue(() => loadSensorData(), "Clock", "GPU Core") || "N/A";
        return value;
    },
    getGPULoad: async () => {
        const value = await waitForValue(() => loadSensorData(), "Load", "GPU Core") || "N/A";
        return value;
    }
});