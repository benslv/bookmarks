import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error("SESSION_SECRET must be set");
}

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "__session",
			maxAge: 60,
			path: "/",
			sameSite: "lax",
			secrets: [sessionSecret],
			secure: true,
		},
	});

export { commitSession, destroySession, getSession };
