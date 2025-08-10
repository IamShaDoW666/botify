"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_1 = require("../controllers/message");
const router = (0, express_1.Router)({ mergeParams: true });
router.post('/send-text', message_1.sendText);
router.post('/send-media', message_1.sendMedia);
router.post('/send-bulk', message_1.sendBulk);
exports.default = router;
