import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode, sign, verify} from "hono/jwt"

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>()


userRouter.post('/signup', async (c) => {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: body.password
      }
    });

    const jwt = await sign({
      id: newUser.userID,
      email: newUser.email
    }, c.env.JWT_SECRET);

    //console.log("New user created: ", newUser);
    c.status(201);
    return c.text("Signup successful!");

  } catch(e) {
    c.status(400);
    return c.text("Unsuccessful Signup!");

  }
})

userRouter.post('/login', (c) => {
  return c.text("Welcome to the login page!");
})


