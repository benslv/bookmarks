import crypto from "node:crypto";

export function validateToken(token: string): boolean {
	const encoder = new TextEncoder();

	const a = encoder.encode(String(token));
	const b = encoder.encode(process.env.AUTH_TOKEN);

	if (a.byteLength !== b.byteLength) {
		return false;
	}

	return crypto.timingSafeEqual(a, b);
}
