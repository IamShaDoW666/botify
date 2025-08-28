import { type DeviceStatus } from "@repo/db";
export declare const updateDeviceStatus: (number: string, status: DeviceStatus) => Promise<{
    status: import("@repo/db").$Enums.DeviceStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    messagesSent: number;
    body: string;
}>;
//# sourceMappingURL=helper.d.ts.map