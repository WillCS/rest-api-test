import EncryptionService from './encryptionService';

type User = {
    username: string,
    hashedPassword: string
};

type AuthToken = {
    selector: string,
    validator: string,
}

type SessionData = {
    selector: string,
    hashedValidator: string,
    username: string,
    expiry: Date
}

export default class AuthenticationService {

    // These are our """"""""databases""""""""
    private users: Map<string, User>;
    private sessions: Map<string, SessionData>;

    private encryptionService: EncryptionService;

    constructor() {
        this.users = new Map<string, User>();
        this.sessions = new Map<string, SessionData>();
        this.encryptionService = new EncryptionService();
    }

    public newUser(username: string, password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if(this.users.has(username)) {
                resolve(false);
            } else {
                this.encryptionService.encrypt(password).then(hash => {
                    this.users.set(username, { 
                        username: username, 
                        hashedPassword: hash
                    });
        
                    resolve(true);
                });
            }
        });
    }

    public async logIn(username: string, password: string, remember: boolean = false): Promise<AuthToken> {
        await this.checkUserExists(username);
        await this.validatePassword(username, password);

        const selector = await this.generateTokenSelector();
        const validator = await this.generateTokenValidator(selector);
        const hashedValidator = await this.hashTokenValidator(validator);
        
        await this.createSession(selector, hashedValidator, username, remember);

        return { selector, validator };
    }

    public authenticate(selector: string, validator: string, timestamp: Date): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if(this.sessions.has(selector)) {
                let hashedValidator: string = this.sessions.get(selector)!.hashedValidator;
                let expiryDate: Date = this.sessions.get(selector)!.expiry;

                if(timestamp.valueOf() > expiryDate.valueOf()) {
                    this.encryptionService.comparePasswords(validator, hashedValidator).then(result => {
                        if(result && result === true) {
                            resolve(this.sessions.get(selector)!.username);
                        } else {
                            reject();
                        }
                    });
                } else {
                    this.sessions.delete(selector);
                    reject();
                }
            } else {
                reject();
            }
        });
    }

    private checkUserExists(username: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if(this.users.has(username)) {
                resolve();
            } else {
                reject();
            }
        });
    }

    private validatePassword(username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let hashedPassword: string = this.users.get(username)!.hashedPassword;
            this.encryptionService.comparePasswords(password, hashedPassword).then(result => {
                if(result) {
                    resolve();
                } else {
                    reject();
                }
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    private generateTokenSelector(): Promise <string> {
        return this.encryptionService.generateRandomToken(16);
    }

    private generateTokenValidator(selector: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.encryptionService.generateRandomToken().then(validator => {
                resolve(validator);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    private hashTokenValidator(validator: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.encryptionService.encrypt(validator).then(hash => {
                resolve(hash);
            });
        });
    }

    private createSession(selector: string, hashedValidator: string, username: string, longToken: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let expiryEpoch: number = Date.now();
            if(longToken) {
                expiryEpoch += new Date(0, 0, 0, 1, 0, 0, 0).valueOf();
            } else {
                expiryEpoch += new Date(10, 0, 0, 0, 0, 0, 0).valueOf();
            }

            const expiry = new Date(expiryEpoch);

            this.sessions.set(selector, {
                selector,
                hashedValidator,
                username,
                expiry
            });

            resolve();
        });
    }
}