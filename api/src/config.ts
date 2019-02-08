import fs from 'fs';

const configDir: string = './config/';

export interface Config {
    useHTTPS: boolean;
}

export default ((): Config => {
    let configFile: string;

    switch(process.env.NODE_ENV) {
        case 'development':
            configFile = 'config.dev.json';
            break;
        case 'production':
            configFile = 'config.prod.json';
            break;
        default:
            throw new Error('Invalid environment.');
    }

    const configString: string = fs.readFileSync(configDir + configFile).toString();
    const config = JSON.parse(configString);

    return config;
})();
