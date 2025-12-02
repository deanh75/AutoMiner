const cpuNameEl = document.getElementById("cpuName")!;
const cpuCoresEl = document.getElementById("cpuCores")!;
// CPU hashrate
const cpuThreadsEl = document.getElementById("cpuThreads")!;
const cpuSpeedEl = document.getElementById("cpuSpeed")!;
const cpuTempEl = document.getElementById("cpuTemp")!;
const cpuLoadEl = document.getElementById("cpuLoad")!;
const cpuRingFillEl = document.getElementById("cpuRingFill")!;
const gpuEl = document.getElementById("gpuName")!;
const gpuSpecEl = document.getElementById("gpuSpecs")!;
// GPU hashrate
const gputempEl = document.getElementById("gpuTemp")!;
const gpuCoreClockEl = document.getElementById("gpuCoreClock")!;
const gpuMemClockEl = document.getElementById("gpuMemClock")!;
const gpuLoadEl = document.getElementById("gpuCoreLoad")!;
const gpuRingFillEl = document.getElementById("gpuRingFill")!;
// const uptimeEl = document.getElementById("uptime")!;

function setCpuLoad(load: string) {
    let loadDec = parseFloat(load.replace("%", ""));
    loadDec = Math.min(Math.max(loadDec, 0), 100);
    
    const circumference = 2 * Math.PI * 48; // same as r
    const offset = circumference * (1 - loadDec / 100);

    cpuRingFillEl.style.strokeDashoffset = offset.toString();
    cpuLoadEl.textContent = load;
}

function setGpuLoad(load: string) {
    let loadDec = parseFloat(load.replace("%", ""));
    loadDec = Math.min(Math.max(loadDec, 0), 100);
    
    const circumference = 2 * Math.PI * 48; // same as r
    const offset = circumference * (1 - loadDec / 100);

    gpuRingFillEl.style.strokeDashoffset = offset.toString();
    gpuLoadEl.textContent = load;
}


async function updateStats() {
    if (!window.systemInfo) return;

    cpuNameEl.textContent = (await window.systemInfo.getCPUName());
    cpuTempEl.textContent = (await window.systemInfo.getCPUTemp());
    setCpuLoad(await window.systemInfo.getCPULoad());
    gpuEl.textContent = (await window.systemInfo.getGPU());
    gpuSpecEl.textContent = (await window.systemInfo.getGPUTotalMem());
    gputempEl.textContent = (await window.systemInfo.getGPUTemp());
    gpuCoreClockEl.textContent = (await window.systemInfo.getGPUCoreClock());
    gpuMemClockEl.textContent = (await window.systemInfo.getGPUMemClock());
    setGpuLoad(await window.systemInfo.getGPULoad());
    // uptimeEl.textContent = "Uptime: " + window.appInfo.getDynamicUptime();
}

async function updateStaticCPUInfo() {
    if (!window.systemInfo) return;

    cpuCoresEl.textContent = (await window.systemInfo.getCPUCores());
    cpuThreadsEl.textContent = (await window.systemInfo.getCPUThreads()).toString();
    cpuSpeedEl.textContent = await window.systemInfo.getCPUSpeed();
}

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        console.log("Calling updateStaticCPUInfo...");
        updateStaticCPUInfo();
    }, 100);
});

// updateStaticCPUInfo();

setInterval(updateStats, 1000);
updateStats();