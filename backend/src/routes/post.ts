import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
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

postRouter.use("*", async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      c.status(401);
      return c.json({ message: "Unauthorized access!" });
    }

    const token = authHeader.split(" ")[1];
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userID", String(user.userID));
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
    return c.json({ message: "Invalid Post Inputs!" });
  }

  try {
    const userID = parseInt(c.get("userID"));
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const newPost = await prisma.post
      .create({
        data: {
          authorID: userID,
          title: body.title,
          content: body.content,
        },
      })
      .catch((e) => {
        console.error("Prisma Create error: ", e);
      });

    c.status(201);
    return c.json({ message: "Posted successfully.", post: newPost });
  } catch (e) {
    c.status(400);
    return c.json({ message: "Posting failed!.", error: e });
  }
});

postRouter.put("/:postID", (c) => {
  return c.text("post edit route.");
});

postRouter.get("/:postID", (c) => {
  return c.text("view post route.");
});
