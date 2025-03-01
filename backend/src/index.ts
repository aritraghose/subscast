import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode, sign, verify} from "hono/jwt"
import { userRouter, postRouter, feedRouter } from "./routes/user";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>()

app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);
app.route("/api/v1", feedRouter);


export default app
