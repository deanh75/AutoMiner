import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { contextBridge } from "electron";

const configPath = './src/monitor/LibreHardwareMonitor.config';

contextBridge.exposeInMainWorld("monitorSettings", {
    writeConfigValue: async (key: string, value: string) => {
        const xmlWrite = fs.readFileSync(configPath, 'utf-8');
        const parserWrite = new xml2js.Parser();
        const builderWrite = new xml2js.Builder();
        
        parserWrite.parseString(xmlWrite, (err, result) => {
            if (err) throw err;

            // Find the key and change its value
            const settings = result.configuration.appSettings[0].add;
            const setting = settings.find((s: any) => s.$.key === key);
            setting.$.value = value;

            // Convert back to XML
            const updatedXml = builderWrite.buildObject(result);
            fs.writeFileSync(configPath, updatedXml, 'utf-8');

            console.log('XML config updated!');
        });
    },
    readConfigValue: async (key: string) => {
        const xmlRead = fs.readFileSync(configPath, 'utf-8');
        const parserRead = new xml2js.Parser();
        
        const result = await parserRead.parseStringPromise(xmlRead);

        const settings = result.configuration.appSettings[0].add;
        const setting = settings.find((s: any) => s.$.key === key);

        return setting ? setting.$.value : "Key Not Found In XML";
    }
});