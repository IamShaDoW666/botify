import type { autoreplies_type, blasts_type } from "@prisma/client";
import type { WASocket } from "baileys";
export type IMessage = {
    text?: string;
    caption?: string;
    image?: {
        url: string;
    };
};
export declare const sendBlast: (client: WASocket, receiver: string, message: string, type: blasts_type | autoreplies_type) => Promise<boolean>;
//# sourceMappingURL=message.d.ts.map