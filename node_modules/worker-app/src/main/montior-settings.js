import * as fs from 'fs';
import * as xml2js from 'xml2js';
const configPath = '../monitor/LibreHardwareMonitor.config';
const xml = fs.readFileSync(configPath, 'utf-8');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
parser.parseString(xml, (err, result) => {
    if (err)
        throw err;
    // Find the key and change its value
    const settings = result.configuration.appSettings[0].add;
    const portSetting = settings.find((s) => s.$.key === 'TemperatureUnit');
    portSetting.$.value = '8080';
    // Convert back to XML
    const updatedXml = builder.buildObject(result);
    fs.writeFileSync(configPath, updatedXml, 'utf-8');
    console.log('XML config updated!');
});
//# sourceMappingURL=montior-settings.js.map