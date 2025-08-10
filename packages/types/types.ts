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
