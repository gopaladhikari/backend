import { z, ZodType } from "zod";
import { UserDetails } from "../controllers/controller.js";

export const updateUserSchema: ZodType<UserDetails> = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Email is required" }),
});
