import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { postInput, commentInput } from "../../../common/src/index";

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userID: string;
  };
}>();

postRouter.use("/", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    c.status(403);
    return c.json({ message: "Unauthorized access!" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userID", user.userID as string);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "Unauthorized access!" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ message: "Unauthorized access!" });
  }
});

postRouter.post("/new", async (c) => {
  const body = await c.req.json();
  const { success } = postInput.safeParse(body);

  if (!success) {
    c.status(400);
    c.json({ message: "Invalid Post Inputs!" });
  }

  try {
    const authorID = c.get("userID");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // paused
  } catch (e) {}
});

postRouter.put("/:postID", (c) => {
  return c.text("post edit route.");
});

postRouter.get("/:postID", (c) => {
  return c.text("view post route.");
});
