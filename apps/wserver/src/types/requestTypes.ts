import type { Blast } from "@repo/db";

export interface ISentText {
  sender: string;
  number: string;
  text?: string;
  type?: string;
}

export interface ISentMedia {
  token: string;
  number: string;
  type?: string;
  url?: string;
  fileName?: string
  caption?: string
}

export interface ISendBulk {
  data: Blast[]
  delay: number
}

export interface IResponse {
  status: boolean
  message: string
  append?: any
}

