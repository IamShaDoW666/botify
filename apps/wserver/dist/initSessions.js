"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./utils/db"));
const logger_1 = __importDefault(require("./utils/logger"));
const whatsapp_1 = require("./whatsapp");
const initSessions = async () => {
    init();
    setInterval(async () => {
        init();
    }, 900000);
};
const init = async () => {
    const devices = await db_1.default.numbers.findMany();
    logger_1.default.info(`Initializing ${devices.length} devices...`);
    devices.forEach((device) => {
        if (device.status === "Connected") {
            return; // Skip already connected devices
        }
        (0, whatsapp_1.initializeWhatsapp)(device.body);
    });
};
exports.default = initSessions;
