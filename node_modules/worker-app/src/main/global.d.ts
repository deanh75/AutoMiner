export {};

declare global {
    interface Window {
        systemInfo: {
            getCPU: () => Promise<string>;
            getCPUTemp: () => Promise<number | string>;
            getGPU: () => Promise<string>;
            getGPUTemp: () => Promise<number | string>;
            getUptime: () => Promise<number>;
        };
    }
}
