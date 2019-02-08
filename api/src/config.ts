import fs from 'fs';

const configDir: string = './config/';

export interface Config {
    useHTTPS: boolean;
}

export default ((): Config => {
    let configFile: string;
    let useDefault: boolean = false;

    switch(process.env.NODE_ENV) {
        case 'development':
            configFile = 'config.dev.json';
            break;
        case 'production':
            configFile = 'config.prod.json';
            break;
        default:
            configFile = 'config.json';
            useDefault = true;
            break;
    }

    const configString: string = fs.readFileSync(configDir + configFile).toString();
    const config = JSON.parse(configString);

    if(!useDefault) {
        const defaultConfigString: string = fs.readFileSync(configDir + 'config.json').toString();
        const defaultConfig = JSON.parse(defaultConfigString);

        for(const key in defaultConfig) {
            if(!config.hasOwnProperty(key)) {
                config[key] = defaultConfig[key];
            }
        }
    }

    return config;
})();
