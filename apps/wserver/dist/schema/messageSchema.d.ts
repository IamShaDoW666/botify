import z from "zod";
export declare const sendTextSchema: z.ZodObject<{
    token: z.ZodString;
    number: z.ZodString;
    text: z.ZodString;
    type: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number: string;
    text: string;
    token: string;
    type?: string | undefined;
}, {
    number: string;
    text: string;
    token: string;
    type?: string | undefined;
}>;
export type sendTextType = z.infer<typeof sendTextSchema>;
//# sourceMappingURL=messageSchema.d.ts.map