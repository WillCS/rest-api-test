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
                reject();
            } else {
                this.encryptionService.encrypt(password).then(hash => {
                    this.users.set(username, { 
                        username: username, 
                        hashedPassword: hash
                    });
        
                    resolve();
                });
            }
        });
    }

    public logIn(username: string, password: string, remember: boolean = false): Promise<AuthToken> {
        return this.checkUserExists(username)
            .then(() => this.validatePassword(username, password))
            .then(() => this.generateTokenSelector())
            .then(selector => this.generateTokenValidator(selector))
            .then(token => this.hashTokenValidator(token))
            .then(result => this.generateExpiryDate(result, username, remember))
            .then(result => this.storeSecureToken(result));
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
            this.encryptionService.comparePasswords(password, this.users.get(username)!.hashedPassword).then(result => {
                if(result) {
                    resolve()
                }
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    private generateTokenSelector(): Promise <string> {
        return this.encryptionService.generateRandomToken(16);
    }

    private generateTokenValidator(selector: string): Promise<AuthToken> {
        return new Promise<AuthToken>((resolve, reject) => {
            this.encryptionService.generateRandomToken().then(validator => {
                resolve({ selector, validator });
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    private hashTokenValidator(authToken: AuthToken): Promise<AuthToken & { hashedValidator: string }> {
        return new Promise<AuthToken & { hashedValidator: string }>((resolve, reject) => {
            this.encryptionService.encrypt(authToken.validator).then(hash => {
                resolve({ 
                    selector: authToken.selector, 
                    validator: authToken.validator, 
                    hashedValidator: hash 
                });
            });
        });
    }

    private generateExpiryDate(prevResult: AuthToken & { hashedValidator: string}, username: string, longToken: boolean): Promise<SessionData & { validator: string }> {
        return new Promise<SessionData & { validator: string }>((resolve, reject) => {
            let expiryDate: number = Date.now();
            if(longToken) {
                expiryDate += new Date(0, 0, 0, 1, 0, 0, 0).valueOf();
            } else {
                expiryDate += new Date(10, 0, 0, 0, 0, 0, 0).valueOf();
            }
            resolve({
                selector: prevResult.selector,
                hashedValidator: prevResult.hashedValidator,
                username: username,
                expiry: new Date(expiryDate),
                validator: prevResult.validator
            });
        });
    }

    private storeSecureToken(prevResult: SessionData & { validator: string }): Promise<AuthToken> {
        return new Promise<AuthToken>((resolve, reject) => {
            this.sessions.set(prevResult.selector, prevResult as SessionData);
            resolve(prevResult as AuthToken);
        });
    }
}