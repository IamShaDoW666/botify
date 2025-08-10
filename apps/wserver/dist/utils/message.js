"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBlast = void 0;
const mime_1 = __importDefault(require("mime"));
const logger_1 = require("./logger");
const sendBlast = async (client, receiver, message, type) => {
    try {
        //Get the JID if receiver is just number or not
        let number = "";
        if (/[^0-9]/g.test(receiver)) {
            number = receiver;
        }
        else {
            const resultArray = await client.onWhatsApp(receiver);
            const result = Array.isArray(resultArray) && resultArray.length > 0
                ? resultArray[0]
                : { jid: "", exists: false };
            number = result.jid;
        }
        const msg = JSON.parse(message);
        let res;
        if (type === "text") {
            res = await client?.sendMessage(number, {
                text: msg.text ?? "",
            });
        }
        else if (type === "image") {
            res = await client.sendMessage(number, {
                caption: msg.caption ?? "",
                image: { url: msg.image?.url ?? "" },
                mimetype: mime_1.default.getType(msg.image?.url ?? "") ?? "",
            });
        }
        if (res?.status === 1) {
            return true;
        }
        else {
            (0, logger_1.logToFile)({ message: `Failed to send message status: ${res?.status}` });
            return false;
        }
    }
    catch (error) {
        console.log(error);
        (0, logger_1.logToFile)({ message: `Failed to send message error: ${error}` });
        return false;
    }
};
exports.sendBlast = sendBlast;
