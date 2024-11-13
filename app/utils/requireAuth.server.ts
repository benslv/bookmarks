import { redirect } from "@remix-run/node";
import { getSession } from "~/session.server";
import { validateToken } from "./validateToken.server";

export async function requireAuth(request: Request) {
	const session = await getSession(request.headers.get("Cookie"));

	if (!session.has("token")) {
		throw redirect("/login");
	}

	const token = String(session.get("token"));

	if (validateToken(token)) {
		throw redirect("/login");
	}
}
