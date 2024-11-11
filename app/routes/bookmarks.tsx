import { ActionFunctionArgs, json } from "@remix-run/node";
import { eq } from "drizzle-orm/sql";

import { z } from "zod";
import db from "~/db";
import { bookmarksTable, insertBookmarkSchema } from "~/db/schema";
import { fetchTitle } from "~/utils/fetchMetadata.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const intent = formData.get("intent");

	switch (intent) {
		case "create": {
			const parseResult = insertBookmarkSchema.safeParse({
				url: formData.get("url"),
				title: formData.get("title"),
				dateAdded:
					formData.get("dateAdded") &&
					new Date(String(formData.get("dateAdded"))),
				folder: formData.get("folder"),
			});

			if (!parseResult.success) {
				console.log(parseResult.error);
				return null;
			}

			const { url, dateAdded, folder } = parseResult.data;

			const title = parseResult.data.title ?? (await fetchTitle(url));

			const bookmark = await db
				.insert(bookmarksTable)
				.values({ url, title, dateAdded, folder });

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
				.set({ folder: "archive" })
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
