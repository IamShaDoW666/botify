import { phoneNumberSchema } from "@repo/types";
import { type DeviceStatus, prisma } from "@repo/db";

export const updateDeviceStatus = async (number: string, status: DeviceStatus) => {
  const { data: validatedNumber, success } = phoneNumberSchema.safeParse(number)
  if (!success) {
    throw new Error(`Invalid phone number format: ${number}`);
  }
  const update = await prisma.device.update({
    data: {
      status
    },
    where: {
      body: validatedNumber
    }
  })

  if (!update) {
    throw new Error(`Failed to update device status for ${number}`);
  }

  return update;
}
