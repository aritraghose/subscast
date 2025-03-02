import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode, sign, verify} from "hono/jwt"

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>()


postRouter.post("/new", (c) => {
  return c.text("new post creation route.");
})

postRouter.put("/:postID", (c) => {
  return c.text("post edit route.");
})

postRouter.get("/:postID", (c) => {
  return c.text("view post route.");
})