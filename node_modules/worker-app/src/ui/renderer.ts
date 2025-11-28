const cpuEl = document.getElementById("cpu")!;
const gpuEl = document.getElementById("gpu")!;
const cputempEl = document.getElementById("cpu_temp")!;
const gputempEl = document.getElementById("gpu_temp")!;
const uptimeEl = document.getElementById("uptime")!;

async function updateStats() {
    if (!window.systemInfo) return;

    cpuEl.textContent = "CPU: " + (await window.systemInfo.getCPU());
    gpuEl.textContent = "GPU: " + (await window.systemInfo.getGPU());
    cputempEl.textContent = "CPU Temp: " + (await window.systemInfo.getCPUTemp()) + "°C";
    gputempEl.textContent = "GPU Temp: " + (await window.systemInfo.getGPUTemp()) + "°C";
    uptimeEl.textContent = "Uptime: " + Math.round((await window.systemInfo.getUptime()) / 60) + " minutes";
}

// Update every second
setInterval(updateStats, 1000);
updateStats();