import z from "zod";

export const deviceCreateSchema = z.object({
  number: z.string().min(1, "Device number is required"),
})
export type DeviceCreateValues = z.infer<typeof deviceCreateSchema>;


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

