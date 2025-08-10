import z from "zod";

export const sendTextSchema = z.object({
  token: z.string().regex(/^\d+$/, {
    message: "Token must be a valid phone number",
  }),
  number: z.string().regex(/^\d+$/, {
    message: "Number must be a valid phone number",
  }),
  text: z.string().min(1, { message: "Text is required" }),
  type: z.string().optional(),
});

export type sendTextType = z.infer<typeof sendTextSchema>;
