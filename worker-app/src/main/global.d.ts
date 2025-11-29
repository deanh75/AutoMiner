export {};

declare global {
    interface Window {
        systemInfo: {
            getCPUName: () => Promise<string>;
            getCPUSpecs: () => Promise<string>;
            getCPUTemp: () => Promise<string>;
            getCPULoad: () => Promise<string>;
            // getGPU: () => Promise<string>;
            // getGPUTemp: () => Promise<number | string>;
            // getGPUClock: () => Promise<number | string>;
            // getGPULoad: () => Promise<number | string>;
        };

        appInfo: {
            getDynamicUptime: () => string;
        };
    }
}
