import z from "zod";

// Helper schema for an address object, allowing for a string or object format
const addressSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    address: z.email(),
  }),
]);

// Helper schema for an array of address objects
const addressesSchema = z.union([addressSchema, z.array(addressSchema)]);

const textHtmlSchema = z.union([z.string(), z.instanceof(Buffer)]);

// The main schema for Nodemailer's mail options
export const sendMailSchema = z.object({
  displayName: z.string().optional(),
  from: addressSchema.optional(),
  to: addressesSchema,
  cc: addressesSchema.optional(),
  bcc: addressesSchema.optional(),
  replyTo: addressesSchema.optional(),
  subject: z.string(),
  text: textHtmlSchema,
  html: textHtmlSchema,
});

// Example of how to infer a TypeScript type from the schema
export type SendMailOptionsType = z.infer<typeof sendMailSchema>;
