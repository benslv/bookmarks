import { createCookieSessionStorage } from "@remix-run/node";
import env from "./utils/env.server";

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "__session",
			maxAge: 60,
			path: "/",
			sameSite: "lax",
			secrets: [env.SESSION_SECRET],
			secure: true,
		},
	});

export { commitSession, destroySession, getSession };
