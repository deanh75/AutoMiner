export {};

declare global {
    interface Window {
        systemInfo: {
            getCPUName: () => Promise<string>;
            getCPUCores: () => Promise<string>;
            getCPUThreads: () => Promise<number>;
            getCPUTemp: () => Promise<string>;
            getCPULoad: () => Promise<string>;
            getCPUSpeed: () => Promise<string>;
            getGPU: () => Promise<string>;
            getGPUTemp: () => Promise<string>;
            getGPUCoreClock: () => Promise<string>;
            getGPUMemClock: () => Promise<string>;
            getGPULoad: () => Promise<string>;
            getGPUTotalMem: () => Promise<string>;
        };

        appInfo: {
            getDynamicUptime: () => string;
        };
    }
}
