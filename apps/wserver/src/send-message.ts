
import { Queue } from "bullmq";
import { redis } from "./utils/redis";
import type { WhatsappJob } from "@repo/types";
import { QUEUE_NAME } from "./utils/constants";

const queue = new Queue<WhatsappJob>(QUEUE_NAME, {
  connection: redis
})
const A = "+919495722263";
const B = "+917902708908";

const main = async () => {
  for (let i = 0; i < 100; i++) {
    await queue.add("send-message", { sender: A, type: 'send-message', receiver: B, message: "Hello" }, {
      attempts: 5,
      backoff: {
        type: 'exponential',
      }
    })
  }
}

main().then(() => {
}).finally(() => {
  process.exit(0);
})
