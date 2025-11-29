const cpuNameEl = document.getElementById("cpuName");
const cpuSpecsEl = document.getElementById("cpuSpecs");
const cpuTempEl = document.getElementById("cpuTemp");
const cpuLoadEl = document.getElementById("cpuLoad");
const ringFillEl = document.getElementById("ringFill");
// const gpuEl = document.getElementById("gpu")!;
// const gputempEl = document.getElementById("gpu_temp")!;
// const gpuclockEl = document.getElementById("gpu_clock")!;
// const gpuloadEl = document.getElementById("gpu_load")!;
// const uptimeEl = document.getElementById("uptime")!;
function setCpuLoad(load) {
    let loadDec = parseFloat(load.replace("%", ""));
    loadDec = Math.min(Math.max(loadDec, 0), 100);
    const circumference = 2 * Math.PI * 48; // same as r
    const offset = circumference * (1 - loadDec / 100);
    ringFillEl.style.strokeDashoffset = offset.toString();
    cpuLoadEl.textContent = load;
}
async function updateStats() {
    if (!window.systemInfo)
        return;
    cpuNameEl.textContent = (await window.systemInfo.getCPUName());
    cpuSpecsEl.textContent = (await window.systemInfo.getCPUSpecs());
    cpuTempEl.textContent = (await window.systemInfo.getCPUTemp()).toString();
    setCpuLoad(await window.systemInfo.getCPULoad());
    // gpuEl.textContent = (await window.systemInfo.getGPU());
    // gputempEl.textContent = "GPU Temp: " + (await window.systemInfo.getGPUTemp());
    // gpuclockEl.textContent = "GPU Clock: " + (await window.systemInfo.getGPUClock());
    // gpuloadEl.textContent = "GPU Load: " + (await window.systemInfo.getGPULoad());
    // uptimeEl.textContent = "Uptime: " + window.appInfo.getDynamicUptime();
}
// Update every second
setInterval(updateStats, 1000);
updateStats();
export {};
//# sourceMappingURL=renderer.js.map