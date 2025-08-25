
"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@repo/db";
import { headers } from "next/headers";

export const addAutoreply = async ({ keyword, reply, deviceNumber }: { keyword: string, reply: string, deviceNumber: string }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const device = await prisma.device.findFirst({
    where: {
      body: deviceNumber,
    }
  })
  if (!device) {
    throw new Error("Device not found");
  }
  const data = await prisma.autoreply.create({
    data: {
      keyword,
      reply,
      deviceId: device!.id,
    },
  })
}

export const deleteAutoreply = async ({ id }: { id: string }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const data = await prisma.autoreply.delete({
    where: {
      id: id,
    }
  })
}
