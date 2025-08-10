"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCart = void 0;
const createCart = async (req, res) => {
    console.log(req.body);
    res.status(200).json({ message: "sent!", status: true });
};
exports.createCart = createCart;
