import { z, ZodType } from "zod";
import { RegisterUser } from "../controllers/controller.js";

export const registerSchema: ZodType<RegisterUser> = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Email is required"),
  password: z.string().min(1, "Password is required"),
});
