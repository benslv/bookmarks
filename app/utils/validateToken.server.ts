import crypto from "node:crypto";
import env from "./env.server";

export function validateToken(token: string): boolean {
	const encoder = new TextEncoder();

	const a = encoder.encode(token);
	const b = encoder.encode(env.AUTH_TOKEN);

	if (a.byteLength !== b.byteLength) {
		return false;
	}

	return crypto.timingSafeEqual(a, b);
}
