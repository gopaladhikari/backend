import { z, ZodType } from "zod";
import { RegisterUser } from "../controllers/controller.js";

export const registerSchema: ZodType<RegisterUser> = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
