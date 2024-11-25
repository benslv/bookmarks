import { json, redirect } from "@remix-run/node";
import { z } from "zod";

import { getSession } from "~/session.server";
import { validateToken } from "~/utils/validateToken.server";

export async function authenticateWithSession(request: Request) {
	const session = await getSession(request.headers.get("Cookie"));

	if (!session.has("token")) {
		console.error("Session token not found.");
		throw redirect("/login");
	}

	const token = z.string().safeParse(session.get("token"));

	if (!token.success) {
		console.error("Error parsing token:", token.error);
		throw redirect("/login");
	}

	if (!validateToken(token.data)) {
		console.error("Token does not match expected.");
		throw redirect("/login");
	}
}

export async function authenticateWithHeaders(request: Request) {
	const header = request.headers.get("Authorization");
	if (!header) {
		throw json({ message: "Token not found." }, 400);
	}

	const token = header.replace("Bearer ", "");

	if (!validateToken(token)) {
		throw json({ message: "Invalid token." }, 401);
	}
}
