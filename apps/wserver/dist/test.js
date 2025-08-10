"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("./utils/redis");
const queue = new bullmq_1.Queue("whatsapp-jobs", {
    connection: redis_1.redis
});
const main = async () => {
    queue.add("connect-whatsapp", { number: "917902708909" });
    // for (let i = 0; i < 50; i++) {
    // queue.add("send-message", { number: "917902708908", to: "917012749946", "text": `Hello ${i + 1}` })
    // }
};
main().then();
