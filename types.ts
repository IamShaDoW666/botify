import { phoneNumberSchema } from "@repo/types";
import { z } from "zod";

export const deviceCreateSchema = z.object({
  number: phoneNumberSchema
})
export type DeviceCreateValues = z.infer<typeof deviceCreateSchema>;

export const sendMessageSchema = z.object({
  number: phoneNumberSchema,
  message: z.string().min(1, "Message is required")
})
export type SendMessageValues = z.infer<typeof sendMessageSchema>;

interface ConnectWhatsappJob {
  type: 'connect-whatsapp';
  sender: string;
}

interface SendMessageJob {
  type: 'send-message';
  sender: string;
  noDelay?: boolean;
  receiver: string;
  message: string;
}

export type WhatsappJob = ConnectWhatsappJob | SendMessageJob;

export type SocketEvent = {
  event: "OPEN" | "QR" | "LOGOUT"
  qr?: string;
  profile?: string;
}
