import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default class EncryptionService {

    public async encrypt(toEncrypt: string, saltRounds: number = 10): Promise<string> {
        return await bcrypt.hash(toEncrypt, saltRounds);
    }

    public async generateRandomToken(length: number = 64): Promise<string> {
        return await new Promise((resolve, reject) => {
            crypto.randomBytes(length, (error, buffer) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(buffer.toString('base64'));
                }
            });
        });
    }

    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
