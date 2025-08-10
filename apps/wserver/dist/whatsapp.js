"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWhatsapp = void 0;
exports.LogoutDevice = LogoutDevice;
exports.connectToWhatsApp = connectToWhatsApp;
const baileys_1 = __importStar(require("baileys"));
const node_cache_1 = __importDefault(require("node-cache"));
const logger_1 = __importDefault(require("./utils/logger"));
const fs_1 = __importDefault(require("fs"));
const qrcode_1 = require("qrcode");
const db_1 = __importDefault(require("./utils/db"));
const sessions_1 = __importDefault(require("./utils/sessions"));
const autoreply_1 = __importStar(require("./autoreply"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const redis_auth_1 = require("./auth/redis-auth");
const redis_1 = require("./utils/redis");
const logger = logger_1.default.child({});
logger.level = "info";
const msgRetryCounterCache = new node_cache_1.default();
// const store = makeInMemoryStore({ logger });
// store?.readFromFile("./baileys_store_multi.json");
// save every 10s
// setInterval(() => {
//   store?.writeToFile("./baileys_store_multi.json");
// }, 10_000);
async function LogoutDevice(number, io) {
    const session = sessions_1.default.get(number);
    await session?.logout();
    const device = await db_1.default.numbers.findFirst({
        where: { body: number },
    });
    if (device?.status === "Connected") {
        await db_1.default.numbers.update({
            where: { id: device.id },
            data: { status: "Disconnect" },
        });
    }
    if (fs_1.default.existsSync(`./${number}`)) {
        fs_1.default.rmdirSync(`./${number}`, { recursive: true });
    }
    sessions_1.default.delete(number);
    connectToWhatsApp(number, io);
}
async function connectToWhatsApp(number, io) {
    logger.info("CONNECT TO WHATSAPP");
    const { state, saveCreds } = await (0, redis_auth_1.useRedisAuthState)(redis_1.redis, `${number}`);
    const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
    logger.info(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
    const sock = (0, baileys_1.default)({
        version,
        logger,
        auth: {
            creds: state.creds,
            keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
        },
        markOnlineOnConnect: false,
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
    });
    // store?.bind(sock.ev);
    sock.ev.process(async (events) => {
        if (events["connection.update"]) {
            const device = await db_1.default.numbers.findFirst({
                where: { body: number },
            });
            const update = events["connection.update"];
            const { connection, lastDisconnect, qr } = update;
            if (qr?.length) {
                logger.warn("QRCODE");
                qrcode_terminal_1.default.generate(qr, { small: true }, (qrcodedata) => {
                    console.log(qrcodedata);
                });
                if ((device?.status === "Connected" &&
                    update.connection === "connecting") ||
                    (device?.status === "Connected" && update.connection === "close")) {
                    await db_1.default.numbers.update({
                        where: { id: device.id },
                        data: { status: "Disconnect" },
                    });
                }
                const qrString = await (0, qrcode_1.toDataURL)(qr);
                io.emit("qrcode", {
                    token: number,
                    data: qrString,
                    message: "Scan QR Code",
                });
            }
            if (connection === "open") {
                const connectedDevice = sock.user;
                const connectedNumber = connectedDevice?.id
                    .split(":")[0]
                    .replace(/\D/g, "");
                await db_1.default.numbers.update({
                    where: { id: device?.id },
                    data: { status: "Connected" },
                });
                if (connectedNumber != number.toString()) {
                    io.emit("number-mismatch");
                    await sock.logout();
                }
                else {
                    logger.info("EMITTING CONNECTION OPEN");
                    io.emit("connection-open", {
                        token: connectedNumber,
                        user: {
                            name: connectedDevice?.name,
                            id: connectedNumber,
                        },
                        ppUrl: await sock.profilePictureUrl(sock.user?.id ?? ""),
                    });
                }
            }
            if (connection === "close") {
                if (lastDisconnect?.error?.output?.statusCode === 515) {
                    connectToWhatsApp(`${number}`, io);
                }
                if (lastDisconnect?.error?.output?.statusCode !==
                    baileys_1.DisconnectReason.loggedOut) {
                    if (device?.status === "Connected") {
                        await db_1.default.numbers.update({
                            where: { id: device.id },
                            data: { status: "Disconnect" },
                        });
                    }
                }
                else {
                    // fs.rmdirSync(`./${number}`, { recursive: true });
                    connectToWhatsApp(`${number}`, io);
                    const device = await db_1.default.numbers.findFirst({
                        where: { body: number },
                    });
                    await db_1.default.numbers.update({
                        where: { id: device?.id },
                        data: { status: "Disconnect" },
                    });
                    console.log("Connection closed. You are logged out.");
                }
            }
            console.log("CONNECTION UPDATE", update);
        }
        // credentials updated -- save them
        if (events["creds.update"]) {
            await saveCreds();
        }
        //Initialize autoreplies
        if (events["messages.upsert"]) {
            const upsert = events["messages.upsert"];
            (0, autoreply_1.default)(upsert, number);
            (0, autoreply_1.initTest)(upsert, number);
            // initDebug(upsert, number);
        }
    });
    sessions_1.default.set(number, sock);
}
const initializeWhatsapp = async (number, retries = 2) => {
    logger.info("INTITIALIZE WHATSAPP");
    const { state, saveCreds } = await (0, redis_auth_1.useRedisAuthState)(redis_1.redis, `${number}`);
    const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
    logger.info(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
    const sock = (0, baileys_1.default)({
        logger,
        version,
        auth: {
            creds: state.creds,
            keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
        },
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
    });
    sock.ev.process(async (events) => {
        if (events["connection.update"]) {
            const connectedDevice = sock.user?.id.split(":")[0].replace(/\D/g, "");
            logger.info(`Connected to ${connectedDevice}`);
            const device = await db_1.default.numbers.findFirst({
                where: { body: number },
            });
            const update = events["connection.update"];
            const { connection, lastDisconnect, qr, legacy } = update;
            if (qr?.length) {
                logger.warn("QRCODE");
                qrcode_terminal_1.default.generate(qr, { small: true }, (qrcodedata) => {
                    console.log(qrcodedata);
                });
                if ((device?.status === "Connected" &&
                    update.connection === "connecting") ||
                    (device?.status === "Connected" && update.connection === "close")) {
                    await db_1.default.numbers.update({
                        where: { id: device.id },
                        data: { status: "Disconnect" },
                    });
                }
            }
            if (connection === "open") {
                await db_1.default.numbers.update({
                    where: { id: device?.id },
                    data: { status: "Connected" },
                });
            }
            if (connection === "close") {
                if (lastDisconnect?.error?.output?.statusCode === 515) {
                    if (retries > 0) {
                        console.log(`Retrying connection... Attempts left: ${retries}`);
                        (0, exports.initializeWhatsapp)(number, retries - 1);
                    }
                }
                if (lastDisconnect?.error?.output?.statusCode !==
                    baileys_1.DisconnectReason.loggedOut) {
                    if (device?.status === "Connected") {
                        await db_1.default.numbers.update({
                            where: { id: device.id },
                            data: { status: "Disconnect" },
                        });
                    }
                }
                else {
                    // fs.rmdirSync(`./${number}`, { recursive: true });
                    (0, exports.initializeWhatsapp)(number);
                    const device = await db_1.default.numbers.findFirst({
                        where: { body: number },
                    });
                    await db_1.default.numbers.update({
                        where: { id: device?.id },
                        data: { status: "Disconnect" },
                    });
                    console.log("Connection closed. You are logged out.");
                }
            }
            console.log("CONNECTION UPDATE", update);
        }
        // credentials updated -- save them
        if (events["creds.update"]) {
            await saveCreds();
        }
        //Initialize autoreplies
        if (events["messages.upsert"]) {
            const upsert = events["messages.upsert"];
            (0, autoreply_1.default)(upsert, number);
            (0, autoreply_1.initTest)(upsert, number);
            // initDebug(upsert, number);
        }
    });
    sessions_1.default.set(number, sock);
};
exports.initializeWhatsapp = initializeWhatsapp;
