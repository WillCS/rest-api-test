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
    private users: Map<string, User> = new Map<string, User>();
    private sessions: Map<string, SessionData> = new Map<string, SessionData>();

    private encryptionService: EncryptionService = new EncryptionService();

    public async newUser(username: string, password: string): Promise<boolean> {
        if(this.users.has(username)) {
            return false;
        }

        const hash: string = await this.encryptionService.encrypt(password);
        this.users.set(username, { 
            username: username, 
            hashedPassword: hash
        });

        return true;
    }

    public async logIn(username: string, password: string, remember: boolean = false): Promise<AuthToken> {
        await this.checkUserExists(username);
        await this.validatePassword(username, password);

        const selector: string = await this.generateTokenSelector();
        const validator: string = await this.generateTokenValidator(selector);
        const hashedValidator: string = await this.hashTokenValidator(validator);
        
        await this.createSession(selector, hashedValidator, username, remember);

        return { selector, validator };
    }

    public async authenticate(selector: string, validator: string, timestamp: Date): Promise<string> {
        if(this.sessions.has(selector)) {
            return await this.validateToken(selector, validator, timestamp);
        }

        throw "Session invalid.";
    }

    private async validateToken(selector: string, validator: string, timestamp: Date): Promise<string> {
        const hashedValidator: string = this.sessions.get(selector)!.hashedValidator;
        const expiryDate: Date = this.sessions.get(selector)!.expiry;

        if(timestamp.valueOf() < expiryDate.valueOf()) {
            const matches: boolean = await this.encryptionService.compare(validator, hashedValidator);

            if(matches) {
                return this.sessions.get(selector)!.username;
            }
            
            throw "Bad token.";
        }

        throw "Session expired.";
    }

    private async checkUserExists(username: string): Promise<void> {
        if(this.users.has(username)) {
            return;
        }
        
        throw "User invalid.";
    }

    private async validatePassword(username: string, password: string): Promise<void> {
        const hashedPassword: string = this.users.get(username)!.hashedPassword;
        const matches: boolean = await this.encryptionService.compare(password, hashedPassword);

        if(matches) {
            return;
        }

        throw "Bad password.";
    }

    private async generateTokenSelector(): Promise <string> {
        return await this.encryptionService.generateRandomToken(16);
    }

    private async generateTokenValidator(selector: string): Promise<string> {
        return await this.encryptionService.generateRandomToken();
        
    }

    private async hashTokenValidator(validator: string): Promise<string> {
        return await this.encryptionService.encrypt(validator);
    }

    private async createSession(selector: string, hashedValidator: string, username: string, longToken: boolean): Promise<void> {
        let expiryEpoch: number = Date.now();
        if(!longToken) {
            expiryEpoch += 3600000;  // One hour in milliseoncds because new Date() sucks
        } else {
            expiryEpoch += 315569520000; // Ten years in milliseconds
        }

        const expiry = new Date(expiryEpoch);

        this.sessions.set(selector, {
            selector,
            hashedValidator,
            username,
            expiry
        });
    }
}