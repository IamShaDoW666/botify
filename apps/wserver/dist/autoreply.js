"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTest = void 0;
const axios_1 = __importDefault(require("axios"));
const sessions_1 = __importDefault(require("./utils/sessions"));
const db_1 = __importDefault(require("./utils/db"));
const logger_1 = __importDefault(require("./utils/logger"));
const message_1 = require("./utils/message");
const baileys_1 = require("baileys");
const form_data_1 = __importDefault(require("form-data"));
const common_1 = require("./utils/common");
const initAutoreply = async (upsert, number) => {
    const autoreplies = await db_1.default.autoreplies.findMany({
        where: { device: number },
    });
    const client = sessions_1.default.get(number);
    if (client) {
        autoreplies.map((autoreply) => {
            upsert.messages.map((message) => {
                if ((message.message?.extendedTextMessage?.text ??
                    message.message?.conversation)?.toLowerCase() == autoreply.keyword.toLowerCase() &&
                    !message.key.fromMe) {
                    (0, message_1.sendBlast)(client, message.key.remoteJid ?? "", autoreply.reply, autoreply.type);
                }
            });
        });
    }
};
const initTest = async (upsert, number) => {
    const client = sessions_1.default.get(number);
    if (!client) {
        console.error(`No client found for number: ${number}`);
        return;
    }
    upsert.messages.map(async (message) => {
        if (message.message?.imageMessage?.url?.length && !message.key.fromMe) {
            // Check if message is to a group
            if (message.key.remoteJid?.endsWith("@g.us")) {
                return;
            }
            console.log("Image message received:", message.message.imageMessage.url);
            try {
                const buffer = await (0, baileys_1.downloadMediaMessage)(message, "buffer", {}, { logger: logger_1.default, reuploadRequest: client.updateMediaMessage });
                const form = new form_data_1.default();
                form.append("file", buffer, {
                    filename: "image.jpg",
                    contentType: "image/jpeg",
                });
                // const res = await fetch("https://gm.milanpramod.online/predict", {
                //   method: "POST",
                //   headers: form.getHeaders(),
                //   body: form,
                // });
                const res = await axios_1.default.post("https://gm.milanpramod.online/predict", form, {
                    headers: form.getHeaders(),
                });
                const data = await res.data;
                console.log("Prediction result:", data.result, data.confidence);
                if (data?.result) {
                    (0, message_1.sendBlast)(client, message.key.remoteJid ?? "", JSON.stringify({ text: (0, common_1.generateGoodMorningMessage)() }), "text");
                }
            }
            catch (error) {
                console.error("Error fetching prediction:", error);
            }
        }
    });
};
exports.initTest = initTest;
exports.default = initAutoreply;
