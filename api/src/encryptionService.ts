import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default class EncryptionService {

    public encrypt(toEncrypt: string, saltRounds: number = 10): Promise<string> {
        return bcrypt.hash(toEncrypt, saltRounds);
    }

    public generateRandomToken(length: number = 64): Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(length, (error, buffer) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(buffer.toString('base64'));
                }
            })
        });
    }

    public comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}