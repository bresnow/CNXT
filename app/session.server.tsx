import { createCookieSessionStorage } from "remix";

let sessionSecret = process.env.PRIV as string;
if (typeof sessionSecret !== "string") {
  throw new Error("SESSION_SECRET must be set");
}

export let { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "FM_session",
      secure: true,
      secrets: [sessionSecret],
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });
