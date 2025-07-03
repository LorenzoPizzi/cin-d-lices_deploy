import { scryptSync, timingSafeEqual, randomBytes } from "node:crypto";

export const scrypt = { 
    hash: (password) => {
        const salt = randomBytes(16).toString("hex");
        const buf = scryptSync(password, salt, 64, {
        N: 131072,
        maxmem: 134220800,
        });
        return `${buf.toString("hex")}.${salt}`;
    },

    compare: (plainTextpassword, hash) => {
        const [hashedPassword, salt] = hash.split(".");
        const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
        const clearPasswordBuffer = scryptSync(plainTextpassword, salt, 64, {
        N: 131072,
        maxmem: 134220800,
        })
        return timingSafeEqual(hashedPasswordBuf, clearPasswordBuffer);
    }
}