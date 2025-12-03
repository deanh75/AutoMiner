import { contextBridge, ipcRenderer } from "electron";
import * as si from "systeminformation";
let startTime = 0;
const sensorCache = {};
let ipAddress = "N/A";
let port = 8085;
ipcRenderer.on("startup-timestamp", (_, ts) => {
    startTime = ts;
});
contextBridge.exposeInMainWorld("ipSettings", {
    setIpAddress: (address) => {
        ipAddress = address;
    },
    setPort: (newPort) => {
        port = newPort;
    }
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
        if (ipAddress === "N/A") {
            console.log("IP address not set yet");
            return null;
        }
        const address = ipAddress + ":" + port;
        const response = await fetch("http://" + address + "/data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}
/**
 * Recursively search for a sensor node by Type and Text
 * Returns the Value if found, otherwise null
 */
function findNode(node, type, text, imageURL) {
    if (!node)
        return null;
    // Enforce rule: type and text must either both be provided or neither
    const typeTextValid = (type !== undefined && text !== undefined) || (type === undefined && text === undefined);
    if (!typeTextValid) {
        throw new Error("If 'type' is provided, 'text' must also be provided, and vice versa.");
    }
    const nodes = Array.isArray(node) ? node : [node];
    for (const n of nodes) {
        // Match by imageURL if provided
        if (imageURL && n.ImageURL === imageURL)
            return n;
        // Match by type + text if provided
        if (type && text && n.Type === type && n.Text === text)
            return n;
        // Recurse into children
        if (n.Children && n.Children.length > 0) {
            const childNode = findNode(n.Children, type, text, imageURL);
            if (childNode)
                return childNode;
        }
    }
    return null;
}
/**
 * Quickly find a node by cached ID
 */
function findNodeByID(node, id) {
    if (!node)
        return null;
    const nodes = Array.isArray(node) ? node : [node];
    for (const n of nodes) {
        if (n.id === id)
            return n;
        if (n.Children && n.Children.length > 0) {
            const childNode = findNodeByID(n.Children, id);
            if (childNode)
                return childNode;
        }
    }
    return null;
}
// Polling helper
async function getSensorValue(key, type, text, imageURL) {
    const data = await loadSensorData();
    if (!data)
        return "N/A";
    let node = null;
    if (sensorCache[key] !== undefined) {
        node = findNodeByID(data, sensorCache[key]);
        if (node) {
            // console.log("Using cached ID for", key, ":", sensorCache[key]);
            return imageURL ? node.Text ?? "N/A" : node.Value ?? "N/A";
        }
        else {
            // console.log("Deleting cached ID for", key, "as it is no longer valid.");
            delete sensorCache[key]; // remove invalid cache entry
        }
    }
    // Otherwise, search recursively
    node = findNode(data, type, text, imageURL);
    if (!node)
        return "N/A";
    // Cache the node's ID for future calls
    if (node.id !== undefined) {
        sensorCache[key] = node.id;
        // console.log("Caching ID for", key, ":", node.id);
    }
    return imageURL ? node.Text ?? "N/A" : node.Value ?? "N/A";
}
contextBridge.exposeInMainWorld("systemInfo", {
    getCPUName: async () => {
        const cpu = await getSensorValue("CPUName", undefined, undefined, "images_icon/cpu.png");
        const index = cpu.indexOf("w/");
        if (index === -1) {
            return cpu; // no "w/" found
        }
        return cpu.slice(0, index).trim();
    },
    getCPUCores: async () => {
        const cpu = await si.cpu();
        return cpu.physicalCores + "-Core Processor";
    },
    getCPUThreads: async () => {
        const cpu = await si.cpu();
        return cpu.cores;
    },
    getCPUTemp: async () => await getSensorValue("CPUTemp", "Temperature", "Core (Tctl/Tdie)"),
    getCPULoad: async () => await getSensorValue("CPULoad", "Load", "CPU Total"),
    getCPUSpeed: async () => {
        const cpu = await si.cpu();
        return cpu.speed + " GHz";
    },
    getGPU: async () => {
        let gpu = await getSensorValue("GPU", undefined, undefined, "images_icon/nvidia.png");
        if (gpu === "N/A") {
            gpu = await getSensorValue("GPU", undefined, undefined, "images_icon/ati.png");
        }
        return gpu;
    },
    getGPUTemp: async () => {
        let temp = await getSensorValue("GPUTemp", "Temperature", "GPU Core");
        if (temp === "N/A") {
            temp = await getSensorValue("GPUTemp", "Temperature", "GPU VR SoC");
        }
        return temp;
    },
    getGPUCoreClock: async () => {
        const coreClockString = await getSensorValue("GPUCoreClock", "Clock", "GPU Core");
        return coreClockString.replace(/\.\d+/g, "");
    },
    getGPUMemClock: async () => {
        const memClockString = await getSensorValue("GPUMemClock", "Clock", "GPU Memory");
        return memClockString.replace(/\.\d+/g, "");
    },
    getGPULoad: async () => await getSensorValue("GPULoad", "Load", "GPU Core"),
    getGPUTotalMem: async () => {
        const totalMemString = await getSensorValue("GPUTotalMem", "SmallData", "GPU Memory Total");
        return totalMemString.replace(/\.\d+/g, "");
    }
});
//# sourceMappingURL=preload-stat-loader.js.map