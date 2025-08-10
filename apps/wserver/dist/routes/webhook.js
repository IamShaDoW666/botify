"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { getWebhookUser } from "../services/webhook-service";
const sessions_1 = __importDefault(require("../utils/sessions"));
const router = (0, express_1.Router)();
router.post("/order-payment", async (req, res) => {
    // const number = await getWebhookUser(req.rawBody ?? "", req.headers['x-shopify-hmac-sha256'] as string);
    // if (!number) {
    //   res.status(403).json({ message: "Invalid webhook", status: false });
    //   return;
    // }
    console.log(req.body["billing_address"]["phone"]);
    const client = sessions_1.default.get("917012749946");
    const result = await client?.onWhatsApp(req.body["billing_address"]["phone"].replace(/\D/g, ""));
    if (result) {
        await client?.sendMessage(result ? result[0].jid : "", {
            text: "Your order has been confirmed tracking number [Tracking Number]. Delivery within two working days. For any inquiries, WhatsApp us at +971563680897. Watch product videos on our social media: https://linktr.ee/chenarabia?utm_source=linktree_profile_share&ltsid=a25f405b-ead5-4d39-9502-b5b102f1b6a4",
            image: { url: "https://lovosis.in/logo.jpg" },
            caption: "your order",
        });
    }
    res.status(200).json({ message: "sent!", status: true });
});
router.post("/customer-update", async (req, res) => {
    const client = sessions_1.default.get("971567326895");
    const result = await client?.onWhatsApp(req.body["default_address"]["phone"].replace(/\D/g, ""));
    if (result) {
        await client?.sendMessage(result ? result[0].jid : "", {
            text: `Hi ${req.body["default_address"]["first_name"]}.Thank you for signing up with us on *chenarabia.com*!\n We're excited to have you on board. 🛒\nFor any inquiries, WhatsApp us at +971563680897.\n We're always happy to help! 💬\n Stay tuned for exclusive offers and discounts coming soon to your inbox! ✨\n Best Regards\n\n Chenarabia Teams`,
        });
    }
    res.status(200).json({ message: "sent!", status: true });
});
router.post("/order-create", async (req, res) => {
    const client = sessions_1.default.get("971567326895");
    const result = await client?.onWhatsApp(req.body["billing_address"]["phone"].replace(/\D/g, ""));
    if (result) {
        await client?.sendMessage(result ? result[0].jid : "", {
            text: `Hi ${req.body["billing_address"]["first_name"]}.Thank you for your order! 🎉\n\n Here are your order details:\n order number:${req.body["order_number"]}\n Track your order: ${req.body["order_status_url"]}\n\nFor any inquiries, WhatsApp us at +971563680897.\nThank you for shopping with us 😊:\n *https://chenarabia.com*\n🎥 Watch the latest product videos. 💥\n Explore amazing combo offers. \n👉 Click now! : https://linktr.ee/chenarabia`,
        });
    }
    res.status(200).json({ message: "sent!", status: true });
});
// router.post("/order-update", async (req, res) => {
//   const client = clients.get("971567326895");
//   const result = await client?.onWhatsApp(
//     req.body["billing_address"]["phone"].replace(/\D/g, "")
//   );
//   if (result) {
//     await client?.sendMessage(result ? result[0].jid : "", {
//       text: `Hi ${req.body["customer"]["first_name"]}.We wanted to inform you that your order #${req.body["order_number"]} has been updated.\n 🚚 Shipping Status:${req.body["order_status_url"]}\nIf you have any questions,WhatsApp us at +971563680897.\n Thank you for shopping with us. 😊\n Best Regards\n\n Chenarabia Teams`,
//     });
//   }
//   res.status(200).json({ message: "sent!", status: true });
// });
router.post("/fullfilment_creation", async (req, res) => {
    const client = sessions_1.default.get("971567326895");
    const result = await client?.onWhatsApp(req.body["destination"]["phone"].replace(/\D/g, ""));
    if (result) {
        await client?.sendMessage(result ? result[0].jid : "", {
            text: `Hi ${req.body["destination"]["first_name"]}\n We wanted to inform you that your 🚚 Shipping Status status is: #${req.body["status"]}.\n Your tracking number is:${req.body["tracking_number"]}\n Track your order from:${req.body["tracking_url"]}. 😊\n Best Regards\n\n Chenarabia Teams`,
        });
    }
    res.status(200).json({ message: "sent!", status: true });
});
router.post("/test", async (req, res) => {
    console.log(req.body);
    res.status(200).json({ message: "sent!", status: true });
});
exports.default = router;
