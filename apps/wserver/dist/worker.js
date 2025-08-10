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
const bullmq_1 = require("bullmq");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const redis_auth_1 = require("./auth/redis-auth");
const redis_1 = require("./utils/redis");
const baileys_1 = __importStar(require("baileys"));
const logger_1 = __importDefault(require("./utils/logger"));
const node_cache_1 = __importDefault(require("node-cache"));
const db_1 = __importDefault(require("./utils/db"));
const qrcode_1 = require("qrcode");
const sessions = new Map();
const msgRetryCounterCache = new node_cache_1.default();
async function startWhatsAppSession(number) {
    if (sessions.has(number)) {
        console.log(`Session for ${number} already exists.`);
        return sessions.get(number);
    }
    console.log(`Starting new Baileys session: ${number}`);
    const { state, saveCreds } = await (0, redis_auth_1.useRedisAuthState)(redis_1.redis, `${number}`);
    const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
    const sock = (0, baileys_1.default)({
        version,
        logger: logger_1.default,
        auth: {
            creds: state.creds,
            keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger_1.default),
        },
        markOnlineOnConnect: false,
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
    });
    sessions.set(number, sock);
    sock.ev.process(async (events) => {
        if (events["connection.update"]) {
            const device = await db_1.default.numbers.findFirst({
                where: { body: number },
            });
            const update = events["connection.update"];
            const { connection, lastDisconnect, qr } = update;
            if (qr?.length) {
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
                console.log(qrString);
                // io.emit("qrcode", {
                //   token: number,
                //   data: qrString,
                //   message: "Scan QR Code",
                // });
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
                    // io.emit("number-mismatch");
                    await sock.logout();
                }
                else {
                    logger_1.default.info("EMITTING CONNECTION OPEN");
                    //   io.emit("connection-open", {
                    //     token: connectedNumber,
                    //     user: {
                    //       name: connectedDevice?.name,
                    //       id: connectedNumber,
                    //     },
                    //     ppUrl: await sock.profilePictureUrl(sock.user?.id ?? ""),
                    //   });
                    // }
                }
            }
            if (connection === "close") {
                if (lastDisconnect?.error?.output?.statusCode === 515) {
                    startWhatsAppSession(`${number}`);
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
                    startWhatsAppSession(`${number}`);
                    const device = await db_1.default.numbers.findFirst({
                        where: { body: number },
                    });
                    await db_1.default.numbers.update({
                        where: { id: device?.id },
                        data: { status: "Disconnect" },
                    });
                    console.log("Connection closed. You are logged out.");
                }
                // }
                console.log("CONNECTION UPDATE", update);
            }
            // credentials updated -- save them
            if (events["creds.update"]) {
                await saveCreds();
            }
            //Initialize autoreplies
            if (events["messages.upsert"]) {
                const upsert = events["messages.upsert"];
                // initAutoreply(upsert, number);
                // initTest(upsert, number);
                // initDebug(upsert, number);
            }
        }
    });
    sock.ev.on('connection.update', (update) => {
        if (update.connection === 'close') {
            sessions.delete(number);
            console.log(`Connection closed for ${number}.`);
        }
        else if (update.connection === 'open') {
            console.log(`Connection open for ${number}.`);
        }
    });
    sock.ev.on('creds.update', saveCreds);
    return sock;
}
new bullmq_1.Worker('whatsapp-jobs', async (job) => {
    console.log(`Processing job: ${job.name} for session: ${job.data.number}`);
    // Use a switch to handle different job types
    switch (job.name) {
        case 'connect-whatsapp':
            await startWhatsAppSession(job.data.number);
            break;
        case 'send-message':
            const { number, to, text } = job.data;
            const sock = sessions.get(number);
            if (sock) {
                try {
                    console.log(`Sending message to ${to} from session ${number}`);
                    // const randomDelay = Math.floor(Math.random() * 1000) + 1000;
                    // await sleep(randomDelay); // Random delay between 1 to 2 seconds
                    await sock.sendMessage(`${to}@s.whatsapp.net`, { text });
                }
                catch (error) {
                    console.error('Failed to send message:', error);
                    throw error; // Fail the job so it can be retried
                }
            }
            else {
                throw new Error(`Session ${number} not found. Cannot send message.`);
            }
            break;
        case 'send-bulk-messages':
            break;
    }
}, { connection: redis_1.redis });
