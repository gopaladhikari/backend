import { z } from "zod";

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: z.string().min(1, { message: "New password is required" }),
  })
  .refine(({ newPassword, oldPassword }) => newPassword === oldPassword, {
    message: "New password cannot be the same as old password",
    path: ["newPassword"],
  });
