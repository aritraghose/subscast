import z from "zod";

export const signupInput = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  username: z.string().toLowerCase().min(3, { message: "Username too small!" }),
  password: z.string().min(8, { message: "Password length too small!" }),
});

export const loginInput = z.object({
  username: z.string().toLowerCase(),
  password: z.string(),
});

export const profileInput = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
});

export const postInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const commentInput = z.object({
  content: z.string(),
});

export type SignUpInput = z.infer<typeof signupInput>;
export type LoginInput = z.infer<typeof loginInput>;
export type ProfileInput = z.infer<typeof profileInput>;
export type postInput = z.infer<typeof postInput>;
export type commentInput = z.infer<typeof commentInput>;
