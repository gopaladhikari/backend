import { z, ZodType } from "zod";
import { LoginUser } from "../controllers/controller.js";

export const loginSchema: ZodType<LoginUser> = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
