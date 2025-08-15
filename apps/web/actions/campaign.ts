'use server'

import { createCampaignSchema } from "@/app/(admin)/campaigns/campaignSchema"
import { auth } from "@/lib/auth"
import { QUEUE_NAME } from "@/lib/constants/global"
import { prisma } from "@repo/db"
import { redis } from "@repo/redis"
import { WhatsappJob } from "@repo/types"
import { Queue } from "bullmq"
import { headers } from "next/headers"
import z from "zod"

export const createCampaign = async (values: z.infer<typeof createCampaignSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const data = await prisma.campaign.create({
    data: {
      name: values.name,
      senderNumber: values.sender,
      userId: session?.user?.id!,
      campaignType: "Text",
      message: values.message
    }
  })

  const group = await prisma.contactGroup.findFirst({
    where: {
      id: values.contactGroupId
    },
    include: {
      contacts: true
    }
  })

  group?.contacts.map(async (contact) => {
    await prisma.blast.create({
      data: {
        type: "Campaign",
        messageType: "Text",
        campaignId: data.id,
        contactId: contact.id
      }
    })
  })

  const q = new Queue<WhatsappJob>(QUEUE_NAME, {
    connection: redis
  })
  await q.add("campaign", {
    type: "campaign",
    campaignId: data.id,
    sender: values.sender
  })
}












