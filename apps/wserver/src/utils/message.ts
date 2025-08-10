import type { autoreplies_type, blasts_type } from "@prisma/client";
import type { proto, WASocket } from "baileys";
import mime from "mime";
import { logToFile } from "./logger";

export type IMessage = {
  text?: string;
  caption?: string;
  image?: {
    url: string;
  };
};

export const sendBlast = async (
  client: WASocket,
  receiver: string,
  message: string,
  type: blasts_type | autoreplies_type
) => {
  try {
    //Get the JID if receiver is just number or not
    let number = "";
    if (/[^0-9]/g.test(receiver)) {
      number = receiver;
    } else {
      const resultArray = await client.onWhatsApp(receiver);
      const result =
        Array.isArray(resultArray) && resultArray.length > 0
          ? resultArray[0]
          : { jid: "", exists: false };
      number = result.jid;
    }

    const msg: IMessage = JSON.parse(message);
    let res: proto.WebMessageInfo | undefined;
    if (type === "text") {
      res = await client?.sendMessage(number, {
        text: msg.text ?? "",
      });
    } else if (type === "image") {      
      res = await client.sendMessage(number, {
        caption: msg.caption ?? "",
        image: { url: msg.image?.url ?? "" },
        mimetype: mime.getType(msg.image?.url ?? "") ?? "",
      });
    }
    if (res?.status === 1) {
      return true;
    } else {
      logToFile({ message: `Failed to send message status: ${res?.status}` });
      return false;
    }
  } catch (error) {
    console.log(error);
    logToFile({ message: `Failed to send message error: ${error}` });
    return false;
  }
};
