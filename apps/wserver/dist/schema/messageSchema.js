"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendTextSchema = zod_1.default.object({
    token: zod_1.default.string().regex(/^\d+$/, {
        message: "Token must be a valid phone number",
    }),
    number: zod_1.default.string().regex(/^\d+$/, {
        message: "Number must be a valid phone number",
    }),
    text: zod_1.default.string().min(1, { message: "Text is required" }),
    type: zod_1.default.string().optional(),
});
