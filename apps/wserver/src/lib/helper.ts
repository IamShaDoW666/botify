import { type DeviceStatus, prisma } from "@repo/db";

export const updateDeviceStatus = async (number: string, status: DeviceStatus) => {
  const update = await prisma.device.update({
    data: {
      status
    },
    where: {
      body: number
    }
  })

  if (!update) {
    throw new Error(`Failed to update device status for ${number}`);
  }

  return update;
}
