"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const addContact = async ({ name, phone, groupId }: { name: string, phone: string, groupId: string }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const data = await prisma.contact.create({
    data: {
      name,
      phone,
      userId: session?.user.id!,
      contactGroupId: groupId
    },
  })
}

export const deleteContact = async ({ id }: { id: string }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const data = await prisma.contact.delete({
    where: {
      id: id,
    }
  })
}

export const addContactGroup = async ({ name }: { name: string }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const data = await prisma.contactGroup.create({
    data: {
      name,
      userId: session?.user.id!,
    },
  })
}

export const deleteContactGroup = async ({ id }: { id: string }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const data = await prisma.contactGroup.delete({
    where: {
      id: id,
    }
  })
}
