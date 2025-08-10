"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./utils/db"));
async function main() {
    const autoreply = await db_1.default.autoreplies.create({
        data: {
            type: "text",
            reply: '{"text": "Hello"}',
            device: "917902708908",
            keyword: "Hello",
            user_id: 1,
            created_at: new Date()
        }
    });
    console.log(autoreply?.reply);
    console.log(JSON.stringify({ text: "Hello" }));
}
main();
