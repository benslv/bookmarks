import { ActionFunctionArgs, json } from "@remix-run/node";
import { eq } from "drizzle-orm/sql";

import { z } from "zod";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";
import { fetchMetadata } from "~/utils/fetchMetadata.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const intent = formData.get("intent");

	switch (intent) {
		case "create": {
			const parseResult = z.string().url().safeParse(formData.get("url"));

			if (!parseResult.success) {
				return null;
			}

			const url = parseResult.data;

			const { title } = await fetchMetadata(url);

			const bookmark = await db
				.insert(bookmarksTable)
				.values({ url, title });

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
