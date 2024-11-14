import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";
import { fetchTitle } from "~/utils/fetchMetadata.server";

import { validateToken } from "~/utils/validateToken.server";

const tokenSchema = z.string().min(1);

const createBookmarkSchema = z.object({
	url: z.string().url(),
	title: z.string().optional(),
	dateAdded: z.coerce.date().optional(),
	folder: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const token = tokenSchema.safeParse(formData.get("token"));

	if (!token.success) {
		return json({ message: "Missing auth token." }, 400);
	}

	if (!validateToken(token.data)) {
		return json({ message: "Invalid auth token." }, 401);
	}

	const payload = Object.fromEntries(formData.entries());

	const parseResult = createBookmarkSchema.safeParse(payload);

	if (!parseResult.success) {
		console.error("Parse issue:", parseResult.error);
		return json({ message: "Issue parsing payload." }, 400);
	}

	const { url, dateAdded, folder } = parseResult.data;

	const title = parseResult.data.title ?? (await fetchTitle(url));

	const bookmark = await db
		.insert(bookmarksTable)
		.values({ url, title, dateAdded, folder });

	return json({ bookmark });
}
