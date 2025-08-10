"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.generateGoodMorningMessage = exports.verifyHmacSha256 = void 0;
const crypto_1 = __importDefault(require("crypto"));
const good = ['Good', 'good', 'gd', 'Gd'];
const morning = ['morning', 'morng', 'mrng', 'mng'];
const verifyHmacSha256 = (secret, payload, providedHmac) => {
    // Create HMAC from the secret and the payload using SHA-256
    const hmac = crypto_1.default.createHmac('sha256', secret);
    hmac.update(payload, 'utf8');
    const computedHmac = hmac.digest('hex'); // or 'hex' if you prefer
    // Use timingSafeEqual to compare the HMACs and prevent timing attacks
    return crypto_1.default.timingSafeEqual(Buffer.from(providedHmac, 'base64'), Buffer.from(computedHmac, 'hex'));
};
exports.verifyHmacSha256 = verifyHmacSha256;
const generateGoodMorningMessage = () => {
    return `${good[Math.floor(Math.random() * good.length)]} ${morning[Math.floor(Math.random() * morning.length)]}`;
};
exports.generateGoodMorningMessage = generateGoodMorningMessage;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
