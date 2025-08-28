"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeviceStatus = void 0;
const types_1 = require("@repo/types");
const db_1 = require("@repo/db");
const updateDeviceStatus = async (number, status) => {
    const { data: validatedNumber, success } = types_1.phoneNumberSchema.safeParse(number);
    if (!success) {
        throw new Error(`Invalid phone number format: ${number}`);
    }
    const update = await db_1.prisma.device.update({
        data: {
            status
        },
        where: {
            body: validatedNumber
        }
    });
    if (!update) {
        throw new Error(`Failed to update device status for ${number}`);
    }
    return update;
};
exports.updateDeviceStatus = updateDeviceStatus;
