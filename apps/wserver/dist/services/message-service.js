"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEachBlast = void 0;
const redis_1 = require("../utils/redis");
const sendEachBlast = async (blasts, delay, client) => {
    for (const blast of blasts) {
        await redis_1.blastQueue.add('send-blast', { blastId: blast.id, client: blast.sender });
        // const result = await sendBlast(
        //   client,
        //   blast.receiver,
        //   blast.message,
        //   blast.type
        // );
        //
        // if (result) {
        //   await prisma.blasts.update({
        //     where: { id: blast.id },
        //     data: {
        //       status: "success",
        //       updated_at: new Date(),
        //     },
        //   });
        // } else {
        //   await prisma.blasts.update({
        //     where: { id: blast.id },
        //     data: {
        //       status: "failed",
        //       updated_at: new Date(),
        //     },
        //   });
        // }
    }
};
exports.sendEachBlast = sendEachBlast;
