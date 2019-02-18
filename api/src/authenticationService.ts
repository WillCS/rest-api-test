import EncryptionService from './encryptionService';

interface User {
    username: string;
    hashedPassword: string;
    inventory: Inventory;
}

interface Inventory {
    numSlots: number;
    slots: Slot[];
}

interface Slot {
    slotNumber: number;
    item?: Item;
}

interface Item {
    name: string;
}

const inventory: Inventory = {
    numSlots: 26,
    slots: [
        { slotNumber: 0, item: { name: 'a' } },
        { slotNumber: 1, item: { name: 'b' } },
        { slotNumber: 2, item: { name: 'c' } },
        { slotNumber: 3, item: { name: 'd' } },
        { slotNumber: 4, item: { name: 'e' } },
        { slotNumber: 5, item: { name: 'f' } },
        { slotNumber: 6, item: { name: 'g' } },
        { slotNumber: 7, item: { name: 'h' } },
        { slotNumber: 8, item: { name: 'i' } },
        { slotNumber: 9, item: { name: 'j' } },
        { slotNumber: 10, item: { name: 'k' } },
        { slotNumber: 11, item: { name: 'l' } },
        { slotNumber: 12, item: { name: 'm' } },
        { slotNumber: 13, item: { name: 'n' } },
        { slotNumber: 14, item: { name: 'o' } },
        { slotNumber: 15, item: { name: 'p' } },
        { slotNumber: 16, item: { name: 'q' } },
        { slotNumber: 17, item: { name: 'r' } },
        { slotNumber: 18, item: { name: 's' } },
        { slotNumber: 19, item: { name: 't' } },
        { slotNumber: 20, item: { name: 'u' } },
        { slotNumber: 21, item: { name: 'v' } },
        { slotNumber: 22, item: { name: 'w' } },
        { slotNumber: 23, item: { name: 'x' } },
        { slotNumber: 24, item: { name: 'y' } },
        { slotNumber: 25, item: { name: 'z' } }
    ]
};

interface AuthToken {
    selector: string;
    validator: string;
}

interface SessionData {
    selector: string;
    hashedValidator: string;
    username: string;
    remember: boolean;
    lastSeen: number;
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

        const hashedPassword: string = await this.encryptionService.encrypt(password);
        this.users.set(username, {
            hashedPassword,
            username,
            inventory
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

    public async authenticate(selector: string, validator: string, timestamp: number): Promise<string> {
        if(this.sessions.has(selector)) {
            return await this.validateToken(selector, validator, timestamp);
        }

        throw new Error('Session invalid.');
    }

    public async getInventory(user: string): Promise<Inventory> {
        return this.users.get(user)!.inventory;
    }

    private async validateToken(selector: string, validator: string, timestamp: number): Promise<string> {
        const session: SessionData = this.sessions.get(selector)!;

        if(session.remember || timestamp - session.lastSeen < 3600000) { // 3,600,000 ms = 1 hour
            const matches: boolean = await this.encryptionService.compare(validator, session.hashedValidator);

            if(matches) {
                session.lastSeen = timestamp;
                return session.username;
            }

            throw new Error('Bad token.');
        }

        this.sessions.delete(selector);
        throw new Error('Session expired.');
    }

    private async checkUserExists(username: string): Promise<void> {
        if(this.users.has(username)) {
            return;
        }

        throw new Error('User invalid.');
    }

    private async validatePassword(username: string, password: string): Promise<void> {
        const hashedPassword: string = this.users.get(username)!.hashedPassword;
        const matches: boolean = await this.encryptionService.compare(password, hashedPassword);

        if(matches) {
            return;
        }

        throw new Error('Bad password.');
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

    private async createSession(selector: string, hashedValidator: string, username: string, remember: boolean)
            : Promise<void> {
        const lastSeen: number = Date.now();

        this.sessions.set(selector, {
            selector,
            hashedValidator,
            username,
            remember,
            lastSeen
        });
    }
}
