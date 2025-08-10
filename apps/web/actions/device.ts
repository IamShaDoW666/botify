"use server"

import { auth } from "@/lib/auth";
import { sendErrorResponse, sendSuccessResponse } from "@/lib/network";
import { prisma } from "@repo/db";
import { DeviceCreateValues } from "@/types"
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getDevices = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const devices = await prisma.device.findMany({
    where: {
      userId: session.user.id
    }
  })

  return devices;
}

export const getConnectedDevices = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const devices = await prisma.device.findMany({
    where: {
      userId: session.user.id,
      status: "Connected"
    }
  })

  return devices;
}

export const addDevice = async (data: DeviceCreateValues) => {
  const { number } = data;
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const res = await prisma.device.create({
    data: {
      body: number,
      userId: session?.user.id!, // Ensure you have the user ID from the session
    }
  })

  if (res) {
    return sendSuccessResponse(res);
  } else {
    return sendErrorResponse({
      error: "Failed to add device"
    })
  }
}

export const deleteDevice = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const device = await prisma.device.findFirst({
    where: {
      userId: session?.user.id!,
      id: id
    }
  })
  if (!device) {
    return sendErrorResponse({
      message: "Device not found"
    })
  }

  const res = await prisma.device.delete({
    where: {
      id: device.id
    }
  })
  if (res) {
    revalidatePath("/(admin)/devices");
    return sendSuccessResponse(res);
  } else {
    return sendErrorResponse({
      message: "Failed to delete device"
    })
  }
}
