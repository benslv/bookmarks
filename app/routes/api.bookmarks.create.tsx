import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import db from "~/db";
import { bookmarksTable, insertBookmarkSchema } from "~/db/schema";
import { fetchTitle } from "~/utils/fetchMetadata.server";

import { validateToken } from "~/utils/validateToken.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const tokenSchema = z.string().min(1);

	const token = tokenSchema.safeParse(formData.get("token"));

	if (!token.success) {
		return json({ error: "Missing auth token." }, 400);
	}

	if (!validateToken(token.data)) {
		return json({ error: "Invalid auth token." }, 401);
	}

	const parseResult = insertBookmarkSchema.safeParse({
		url: formData.get("url"),
		title: formData.get("title"),
		dateAdded: new Date(String(formData.get("dateAdded"))),
		folder: formData.get("folder"),
	});

	if (!parseResult.success) {
		return null;
	}

	const { url, dateAdded, folder } = parseResult.data;

	const title = parseResult.data.title ?? (await fetchTitle(url));

	const bookmark = await db
		.insert(bookmarksTable)
		.values({ url, title, dateAdded, folder });

	return json({ bookmark });
}
