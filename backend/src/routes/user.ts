import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import {
  signupInput,
  loginInput,
  profileInput,
} from "../../../common/src/index";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userID: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  try {
    const body = await c.req.json();

    const { success } = signupInput.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid Inputs!" });
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (existingUser) {
      c.status(400);
      return c.json({ message: "Username or email already taken." });
    }

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: body.password,
      },
    });

    const jwt = await sign(
      {
        userID: newUser.userID,
        email: newUser.email,
      },
      c.env.JWT_SECRET,
    );
    c.status(201);
    return c.json({
      message: "Signup successful!",
      newUser: newUser,
      token: jwt,
    });
  } catch (e) {
    c.status(400);
    return c.json({ message: "Unsuccessful Signup!", error: e });
  }
});

userRouter.post("/login", async (c) => {
  try {
    const body = await c.req.json();

    const { success } = loginInput.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid Inputs!" });
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const foundUser = await prisma.user.findFirst({
      where: { username: body.username, password: body.password },
    });

    if (!foundUser) {
      c.status(401);
      return c.json({ message: "Invalid Credentials!" });
    } else {
      const jwt = await sign(
        {
          userID: foundUser.userID,
          email: foundUser.email,
        },
        c.env.JWT_SECRET,
      );

      c.status(200);
      return c.json({ message: "Logged in successful.", token: jwt });
    }
  } catch (e) {
    c.status(401);
    return c.json({ message: "Error occured!", error: e });
  }
});
