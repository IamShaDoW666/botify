"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgRetryCounterCache = exports.sessions = void 0;
const db_1 = require("@repo/db");
const types_1 = require("@repo/types");
const bullmq_1 = require("bullmq");
const node_cache_1 = __importDefault(require("node-cache"));
const whatsapp_1 = require("./lib/whatsapp");
const common_1 = require("./utils/common");
const constants_1 = require("./utils/constants");
const logger_1 = __importDefault(require("./utils/logger"));
const redis_1 = require("./utils/redis");
exports.sessions = new Map();
exports.msgRetryCounterCache = new node_cache_1.default();
setInterval(() => {
    console.log(exports.sessions.keys());
}, 5000);
new bullmq_1.Worker(constants_1.QUEUE_NAME, async (job) => {
    logger_1.default.info(`Processing job: ${job.name} for session: ${job.data.sender}`);
    switch (job.data.type) {
        case 'connect-whatsapp': {
            await (0, whatsapp_1.startWhatsAppSession)(job.data.sender);
            break;
        }
        case 'send-message': {
            const { sender, receiver, message, blastId, noDelay = false } = job.data;
            const { success, data: validatedSender } = types_1.phoneNumberSchema.safeParse(sender);
            if (success === false) {
                logger_1.default.error(`Invalid sender number: ${sender}`);
                break;
            }
            const sock = exports.sessions.get(validatedSender);
            if (sock) {
                try {
                    console.log(`Sending message to ${receiver} from session ${validatedSender}`);
                    //TODO: Good place to add delay
                    if (!noDelay) {
                        const randomDelay = Math.floor(Math.random() * 1000) + 500; // Random delay between 500ms and 1500ms
                        await (0, common_1.sleep)(randomDelay);
                    }
                    // await sock.sendMessage(`${to}@s.whatsapp.net`, { text });
                    const result = await sock.onWhatsApp(receiver);
                    const response = await sock.sendMessage(result ? result[0].jid : "", {
                        text: message,
                    });
                    if (response) {
                        await db_1.prisma.device.update({
                            data: {
                                messagesSent: {
                                    increment: 1,
                                }
                            },
                            where: {
                                body: validatedSender
                            }
                        });
                        if (blastId) {
                            const blast = await db_1.prisma.blast.update({
                                where: {
                                    id: blastId
                                },
                                data: {
                                    status: 'Sent',
                                }
                            });
                        }
                    }
                    console.log(sock, result, response);
                }
                catch (error) {
                    console.error('Failed to send message:', error);
                    throw error; // Fail the job so it can be retried
                }
            }
            else {
                //TODO:: Handle case where session is not found (Message not sent)
                console.error(`Session ${sender} not found. Cannot send message.`);
                throw new Error(`Session ${sender} not found. Cannot send message.`);
            }
            break;
        }
        case 'logout': {
            const { sender } = job.data;
            const { success, data: validatedSender } = types_1.phoneNumberSchema.safeParse(sender);
            if (success === false) {
                logger_1.default.error(`Invalid sender number: ${sender}`);
                break;
            }
            const sock = exports.sessions.get(validatedSender);
            if (sock) {
                await sock.logout();
            }
            break;
        }
        case 'campaign': {
            const { sender, campaignId } = job.data;
            const campaign = await db_1.prisma.campaign.findFirst({
                where: {
                    id: campaignId
                },
                include: {
                    blasts: {
                        include: {
                            contact: true
                        }
                    }
                }
            });
            if (!campaign) {
                break;
            }
            const queue = new bullmq_1.Queue(constants_1.QUEUE_NAME, {
                connection: redis_1.redis,
            });
            campaign.blasts.map(async (blast) => {
                await queue.add("send-message", {
                    type: 'send-message',
                    sender: sender,
                    receiver: blast.contact.phone,
                    blastId: blast.id,
                    message: campaign.message ?? "Default"
                });
            });
        }
    }
}, { connection: redis_1.redis });
async function initializeWorker() {
    logger_1.default.info('WhatsApp worker initialized');
    const queue = new bullmq_1.Queue(constants_1.QUEUE_NAME, {
        connection: redis_1.redis,
    });
    const numbers = await db_1.prisma.device.findMany();
    numbers.forEach(number => {
        queue.add('connect-whatsapp', { sender: number.body, type: 'connect-whatsapp' }, {
            delay: 1000, // Delay to avoid overwhelming the WhatsApp API
            attempts: 1,
        });
    });
}
initializeWorker();
