import { z } from "zod";

import { publicSignUpRoles } from "@/lib/auth-roles";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(100, "Password is too long.");

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: passwordSchema,
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long.").max(80, "Name is too long."),
  email: z.string().email("Enter a valid email address."),
  password: passwordSchema,
  role: z.enum(publicSignUpRoles),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
