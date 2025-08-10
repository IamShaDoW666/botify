"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_1 = __importDefault(require("./message"));
const webhook_1 = __importDefault(require("./webhook"));
const router = (0, express_1.Router)();
router.use("/messages", message_1.default);
router.use("/api/", webhook_1.default);
exports.default = router;
