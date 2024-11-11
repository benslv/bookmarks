import { ActionFunctionArgs, json } from "@remix-run/node";
import { eq } from "drizzle-orm/sql";

import { z } from "zod";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";
import { fetchTitle } from "~/utils/fetchMetadata.server";

const createBookmarkPayload = z.object({
	url: z.string().url(),
	title: z.string().optional(),
	dateAdded: z.coerce.date().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const intent = formData.get("intent");

	switch (intent) {
		case "create": {
			const parseResult = createBookmarkPayload.safeParse({
				url: formData.get("url"),
				title: formData.get("title"),
				dateAdded: formData.get("dateAdded"),
			});

			if (!parseResult.success) {
				console.log(parseResult.error);
				return null;
			}

			const { url, dateAdded } = parseResult.data;

			const title = parseResult.data.title ?? (await fetchTitle(url));

			const bookmark = await db
				.insert(bookmarksTable)
				.values({ url, title, dateAdded });

			return json({ bookmark });
		}

		case "delete": {
			const parseResult = z.coerce.number().safeParse(formData.get("id"));

			if (!parseResult.success) {
				return null;
			}

			const id = parseResult.data;

			const bookmark = await db
				.update(bookmarksTable)
				.set({ folder: "read" })
				.where(eq(bookmarksTable.id, id));

			return json({ bookmark });
		}
	}

	return null;
}

export async function loader() {
	const bookmarks = await db.select().from(bookmarksTable);
	return { bookmarks };
}
