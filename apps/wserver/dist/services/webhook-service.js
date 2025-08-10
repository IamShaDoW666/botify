"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebhookUser = void 0;
const common_1 = require("../utils/common");
const db_1 = __importDefault(require("../utils/db"));
const getWebhookUser = async (payload, hmac) => {
    const users = await db_1.default.users.findMany();
    for (const user of users) {
        if ((0, common_1.verifyHmacSha256)("test", payload, hmac)) {
            const number = await db_1.default.numbers.findFirst({
                where: { user_id: user.id },
            });
            return number;
        }
        return null;
    }
};
exports.getWebhookUser = getWebhookUser;
