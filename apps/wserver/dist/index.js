"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const whatsapp_1 = require("./whatsapp");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const body_parser_1 = __importDefault(require("body-parser"));
const initSessions_1 = __importDefault(require("./initSessions"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./utils/logger"));
// Boot express
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(server, { cors: { origin: "*" } });
const port = 3000;
app.use(body_parser_1.default.json({
    verify(req, _res, buf, encoding) {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || "utf-8");
        }
    },
}));
app.use("/", routes_1.default);
app.post("/delete-device", (_req, res) => {
    res.status(200).json({ message: "DELETED!" });
});
(0, initSessions_1.default)();
exports.io.on("connection", (socket) => {
    // Initialize All devices and set Sessions
    logger_1.default.info("Socket Connected");
    socket.on("StartConnection", (number) => {
        (0, whatsapp_1.connectToWhatsApp)(number, socket); // init a particular device
    });
    socket.on("LogoutDevice", (number) => {
        (0, whatsapp_1.LogoutDevice)(number.toString(), socket);
    });
});
server.listen(port, () => console.log(`Server is listening on port ${port}!`));
// Start server
