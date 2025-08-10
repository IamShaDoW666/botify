"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBulk = exports.sendMedia = exports.sendText = void 0;
const sessions_1 = __importDefault(require("../utils/sessions"));
const mime_1 = __importDefault(require("mime"));
const message_service_1 = require("../services/message-service");
const messageSchema_1 = require("../schema/messageSchema");
const sendText = async (req, res) => {
    const validated = await messageSchema_1.sendTextSchema.safeParse(req.body);
    if (!validated.success) {
        res.status(400).json({
            message: "Invalid request",
            status: false,
            append: validated.error.format(),
        });
        return;
    }
    try {
        const client = sessions_1.default.get(req.body.token);
        const result = await client?.onWhatsApp(req.body.number);
        const response = await client?.sendMessage(result ? result[0].jid : "", {
            text: req.body.text ?? "",
        });
        console.log(client, result);
        if (response) {
            res.status(200).json({ message: "sent!", status: true });
        }
        else {
            res.status(500).json({
                message: "Failed to send message",
                status: false,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to send message",
            status: false,
        });
    }
};
exports.sendText = sendText;
const sendMedia = async (req, res) => {
    const client = sessions_1.default.get(req.body.token);
    const result = await client?.onWhatsApp(req.body.number);
    if (req.body.type === "pdf") {
        await client?.sendMessage(result ? result[0].jid : "", {
            document: { url: req.body.url ?? "" },
            mimetype: mime_1.default.getType(req.body.url ?? "") ?? "",
            caption: req.body.caption,
        });
    }
    else {
        await client?.sendMessage(result ? result[0].jid : "", {
            image: { url: req.body.url ?? "" },
            mimetype: mime_1.default.getType(req.body.url ?? "") ?? "", //mime.getType(req.body.url ?? "") ?? ""
            caption: req.body.caption,
        });
    }
    res.status(200).json({ message: "sent!", status: true });
};
exports.sendMedia = sendMedia;
const sendBulk = async (req, res) => {
    const client = sessions_1.default.get(req.body.data[0].sender);
    if (client) {
        await (0, message_service_1.sendEachBlast)(req.body.data, req.body.delay, client);
        res.status(200).json({ status: true, message: "Messages sent!" });
    }
    else {
        res
            .status(404)
            .json({ message: "Whatsapp session not found!", status: false });
    }
};
exports.sendBulk = sendBulk;
